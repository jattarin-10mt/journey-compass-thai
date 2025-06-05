
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TravelFormData } from '@/types/travelForm';

export const useTravelForm = () => {
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

  const calculateDistance = (startMileage: number, endMileage: number) => {
    return endMileage - startMileage;
  };

  const handleInputChange = (field: keyof TravelFormData, value: string | number) => {
    const updatedData = { ...formData, [field]: value };
    
    if (field === 'startMileage' || field === 'endMileage') {
      const startMileage = field === 'startMileage' ? Number(value) : formData.startMileage;
      const endMileage = field === 'endMileage' ? Number(value) : formData.endMileage;
      updatedData.distance = calculateDistance(startMileage, endMileage);
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
