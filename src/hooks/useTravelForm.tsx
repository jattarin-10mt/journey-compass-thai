
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TravelFormData } from '@/types/travelForm';

export const useTravelForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TravelFormData>({
    projectName: '',
    startDateTime: '',
    startLocation: '',
    startOdometer: 0,
    endDateTime: '',
    endLocation: '',
    endOdometer: 0,
    distance: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDistance = (startOdometer: number, endOdometer: number) => {
    return endOdometer - startOdometer;
  };

  const handleInputChange = (field: keyof TravelFormData, value: string | number) => {
    const updatedData = { ...formData, [field]: value };
    
    if (field === 'startOdometer' || field === 'endOdometer') {
      const startOdometer = field === 'startOdometer' ? Number(value) : formData.startOdometer;
      const endOdometer = field === 'endOdometer' ? Number(value) : formData.endOdometer;
      updatedData.distance = calculateDistance(startOdometer, endOdometer);
    }
    
    setFormData(updatedData);
  };

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
    
    if (formData.startOdometer < 0) {
      return 'เลขไมล์เริ่มต้นต้องเป็นจำนวนบวกค่ะ';
    }
    
    if (!formData.endDateTime) {
      return 'กรุณาระบุวันที่และเวลาที่ถึงปลายทางค่ะ';
    }
    
    if (!formData.endLocation.trim()) {
      return 'กรุณากรอกชื่อสถานที่ปลายทางค่ะ';
    }
    
    if (formData.endOdometer < 0) {
      return 'เลขไมล์ปลายทางต้องเป็นจำนวนบวกค่ะ';
    }
    
    if (formData.endOdometer < formData.startOdometer) {
      return 'เลขไมล์ปลายทางต้องมากกว่าหรือเท่ากับเลขไมล์เริ่มต้นค่ะ';
    }
    
    if (new Date(formData.endDateTime) < new Date(formData.startDateTime)) {
      return 'วันที่และเวลาปลายทางต้องมาหลังจากเวลาเริ่มต้นค่ะ';
    }
    
    return null;
  };

  const submitToGoogleSheets = async (googleSheetsUrl: string) => {
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
          'เลขไมล์เริ่มต้น': formData.startOdometer,
          'วันที่และเวลาปลายทาง': formData.endDateTime,
          'สถานที่ปลายทาง': formData.endLocation,
          'เลขไมล์ปลายทาง': formData.endOdometer,
          'ระยะทางรวม': formData.distance,
          'วันที่บันทึก': new Date().toISOString()
        })
      });

      toast({
        title: "บันทึกข้อมูลสำเร็จ! 🎉",
        description: `ขอบคุณที่ให้ข้อมูลค่ะ คุณเดินทางไปทั้งหมด ${formData.distance} กิโลเมตรในการเดินทางครั้งนี้`,
      });

      setFormData({
        projectName: '',
        startDateTime: '',
        startLocation: '',
        startOdometer: 0,
        endDateTime: '',
        endLocation: '',
        endOdometer: 0,
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

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    validateForm,
    submitToGoogleSheets,
    toast
  };
};
