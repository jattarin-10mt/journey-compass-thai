import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';

interface TravelFormData {
  projectName: string;
  startDateTime: string;
  startLocation: string;
  startMileage: number;
  endDateTime: string;
  endLocation: string;
  endMileage: number;
  distance: number;
}

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TravelFormData>({
    projectName: '',
    startDateTime: '',
    startLocation: '',
    startMileage: 0,
    endDateTime: '',
    endLocation: '',
    endMileage: 0,
    distance: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('https://script.google.com/macros/s/AKfycbxj_aWX55d9o-dBCpA44KDIMkBuhnuFFBC9KDFUWCJNkakMP-iOkez5sR6lgjoJ9uHajQ/exec');

  // คำนวณระยะทางอัตโนมัติ
  const calculateDistance = (startMileage: number, endMileage: number) => {
    return endMileage - startMileage;
  };

  const handleInputChange = (field: keyof TravelFormData, value: string | number) => {
    const updatedData = { ...formData, [field]: value };
    
    // คำนวณระยะทางอัตโนมัติเมื่อไมล์เปลี่ยน
    if (field === 'startMileage' || field === 'endMileage') {
      const startMileage = field === 'startMileage' ? Number(value) : formData.startMileage;
      const endMileage = field === 'endMileage' ? Number(value) : formData.endMileage;
      updatedData.distance = calculateDistance(startMileage, endMileage);
    }
    
    setFormData(updatedData);
  };

  // ตรวจสอบความถูกต้องของข้อมูล
  const validateForm = (): string | null => {
    if (!formData.projectName.trim()) {
      return 'กรุณากรอกชื่อโครงการค่ะ';
    }
    
    if (!formData.startDateTime) {
      return 'กรุณาระบุวันที่และเวลาที่เริ่มเดินทางค่ะ';
    }
    
    if (!formData.startLocation.trim()) {
      return 'กรุณากรอกชื่อสถานที่เริ่มต้นค่ะ';
    }
    
    if (formData.startMileage < 0) {
      return 'เลขไมล์เริ่มต้นต้องเป็นจำนวนบวกค่ะ';
    }
    
    if (!formData.endDateTime) {
      return 'กรุณาระบุวันที่และเวลาที่ถึงปลายทางค่ะ';
    }
    
    if (!formData.endLocation.trim()) {
      return 'กรุณากรอกชื่อสถานที่ปลายทางค่ะ';
    }
    
    if (formData.endMileage < 0) {
      return 'เลขไมล์ปลายทางต้องเป็นจำนวนบวกค่ะ';
    }
    
    if (formData.endMileage < formData.startMileage) {
      return 'เลขไมล์ปลายทางต้องมากกว่าหรือเท่ากับเลขไมล์เริ่มต้นค่ะ';
    }
    
    if (new Date(formData.endDateTime) < new Date(formData.startDateTime)) {
      return 'วันที่และเวลาปลายทางต้องมาหลังจากเวลาเริ่มต้นค่ะ';
    }

    if (!googleSheetsUrl.trim()) {
      return 'กรุณากรอก Google Sheets URL เพื่อบันทึกข้อมูลค่ะ';
    }
    
    return null;
  };

  // ส่งข้อมูลไป Google Sheets
  const submitToGoogleSheets = async () => {
    try {
      console.log('กำลังส่งข้อมูลไป Google Sheets:', formData);
      
      const response = await fetch(googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          'ชื่อโครงการ': formData.projectName,
          'วันที่และเวลาเริ่มต้น': formData.startDateTime,
          'สถานที่เริ่มต้น': formData.startLocation,
          'เลขไมล์เริ่มต้น': formData.startMileage,
          'วันที่และเวลาปลายทาง': formData.endDateTime,
          'สถานที่ปลายทาง': formData.endLocation,
          'เลขไมล์ปลายทาง': formData.endMileage,
          'ระยะทางรวม': formData.distance,
          'วันที่บันทึก': new Date().toISOString()
        })
      });

      toast({
        title: "บันทึกข้อมูลสำเร็จ! 🎉",
        description: `ขอบคุณที่ให้ข้อมูลค่ะ คุณเดินทางไปทั้งหมด ${formData.distance} กิโลเมตรในการเดินทางครั้งนี้`,
      });

      // รีเซ็ตฟอร์ม
      setFormData({
        projectName: '',
        startDateTime: '',
        startLocation: '',
        startMileage: 0,
        endDateTime: '',
        endLocation: '',
        endMileage: 0,
        distance: 0
      });

    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบ URL และลองใหม่อีกครั้งค่ะ",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "กรุณาตรวจสอบข้อมูล",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await submitToGoogleSheets();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              📋 ฟอร์มบันทึกข้อมูลการเดินทาง
            </CardTitle>
            <p className="text-gray-600">กรุณากรอกข้อมูลการใช้รถสำหรับการเดินทางค่ะ</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Sheets URL */}
              <div className="space-y-2">
                <Label htmlFor="googleSheetsUrl" className="text-lg font-medium text-gray-700">
                  🔗 Google Sheets URL สำหรับบันทึกข้อมูล
                </Label>
                <Input
                  id="googleSheetsUrl"
                  type="url"
                  value={googleSheetsUrl}
                  onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                  placeholder="กรุณากรอก URL ของ Google Sheets Web App"
                  className="text-lg p-3"
                />
                <p className="text-sm text-green-600">
                  ✅ เชื่อมต่อแล้ว - พร้อมบันทึกข้อมูลลง Google Sheets
                </p>
              </div>

              {/* ชื่อโครงการ */}
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-lg font-medium text-gray-700">
                  📝 ชื่อโครงการ
                </Label>
                <Input
                  id="projectName"
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="กรุณากรอกชื่อโครงการ"
                  className="text-lg p-3"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* จุดเริ่มต้น */}
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 flex items-center">
                    🚗 ข้อมูลจุดเริ่มต้น
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDateTime" className="text-base font-medium text-gray-700">
                      📅 วันที่และเวลาที่เริ่มเดินทาง
                    </Label>
                    <Input
                      id="startDateTime"
                      type="datetime-local"
                      value={formData.startDateTime}
                      onChange={(e) => handleInputChange('startDateTime', e.target.value)}
                      className="text-base p-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startLocation" className="text-base font-medium text-gray-700">
                      📍 ชื่อสถานที่เริ่มต้น
                    </Label>
                    <Input
                      id="startLocation"
                      type="text"
                      value={formData.startLocation}
                      onChange={(e) => handleInputChange('startLocation', e.target.value)}
                      placeholder="ชื่อสถานที่เริ่มต้นคือที่ไหนคะ?"
                      className="text-base p-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startMileage" className="text-base font-medium text-gray-700">
                      🛣️ เลขไมล์ตอนเริ่มต้น (กม.)
                    </Label>
                    <Input
                      id="startMileage"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.startMileage || ''}
                      onChange={(e) => handleInputChange('startMileage', Number(e.target.value))}
                      placeholder="เลขไมล์ตอนเริ่มต้นคือเท่าไรคะ?"
                      className="text-base p-3"
                    />
                  </div>
                </div>

                {/* จุดปลายทาง */}
                <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-xl font-semibold text-red-800 flex items-center">
                    🏁 ข้อมูลจุดปลายทาง
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDateTime" className="text-base font-medium text-gray-700">
                      📅 วันที่และเวลาที่ถึงปลายทาง
                    </Label>
                    <Input
                      id="endDateTime"
                      type="datetime-local"
                      value={formData.endDateTime}
                      onChange={(e) => handleInputChange('endDateTime', e.target.value)}
                      className="text-base p-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endLocation" className="text-base font-medium text-gray-700">
                      📍 ชื่อสถานที่ปลายทาง
                    </Label>
                    <Input
                      id="endLocation"
                      type="text"
                      value={formData.endLocation}
                      onChange={(e) => handleInputChange('endLocation', e.target.value)}
                      placeholder="ปลายทางคือสถานที่ใด?"
                      className="text-base p-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endMileage" className="text-base font-medium text-gray-700">
                      🛣️ เลขไมล์ตอนถึงปลายทาง (กม.)
                    </Label>
                    <Input
                      id="endMileage"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.endMileage || ''}
                      onChange={(e) => handleInputChange('endMileage', Number(e.target.value))}
                      placeholder="เลขไมล์ตอนถึงปลายทางคือ?"
                      className="text-base p-3"
                    />
                  </div>
                </div>
              </div>

              {/* แสดงระยะทางที่คำนวณได้ */}
              {formData.distance > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">
                      📏 ระยะทางการเดินทาง
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {formData.distance.toFixed(1)} กิโลเมตร
                    </p>
                    <p className="text-gray-600 mt-1">
                      คำนวณจาก: {formData.endMileage} - {formData.startMileage} = {formData.distance.toFixed(1)} กม.
                    </p>
                  </div>
                </div>
              )}

              {/* ปุ่มส่งข้อมูล */}
              <div className="text-center pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      กำลังบันทึกข้อมูล...
                    </>
                  ) : (
                    <>
                      💾 บันทึกข้อมูลการเดินทาง
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* คำแนะนำการใช้งาน */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 คำแนะนำการใช้งาน:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• กรอกข้อมูลให้ครบทุกช่องก่อนกดบันทึก</li>
                <li>• เลขไมล์ปลายทางต้องมากกว่าหรือเท่ากับเลขไมล์เริ่มต้น</li>
                <li>• ระบบจะคำนวณระยะทางโดยอัตโนมัติ</li>
                <li>• ข้อมูลจะถูกส่งไปบันทึกใน Google Sheets "ข้อมูลการเดินทางรถยนต์"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
