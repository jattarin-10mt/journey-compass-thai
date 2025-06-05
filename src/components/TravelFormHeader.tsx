
import { CardHeader, CardTitle } from '@/components/ui/card';

const TravelFormHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
        📋 ฟอร์มบันทึกข้อมูลการเดินทาง
      </CardTitle>
      <p className="text-gray-600">กรุณากรอกข้อมูลการใช้รถสำหรับการเดินทางค่ะ</p>
    </CardHeader>
  );
};

export default TravelFormHeader;
