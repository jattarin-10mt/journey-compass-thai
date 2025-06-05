
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StartPointSectionProps {
  startDateTime: string;
  startLocation: string;
  startMileage: number;
  onDateTimeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onMileageChange: (value: number) => void;
}

const StartPointSection = ({
  startDateTime,
  startLocation,
  startMileage,
  onDateTimeChange,
  onLocationChange,
  onMileageChange
}: StartPointSectionProps) => {
  return (
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
          value={startDateTime}
          onChange={(e) => onDateTimeChange(e.target.value)}
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
          value={startLocation}
          onChange={(e) => onLocationChange(e.target.value)}
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
          value={startMileage || ''}
          onChange={(e) => onMileageChange(Number(e.target.value))}
          placeholder="เลขไมล์ตอนเริ่มต้นคือเท่าไรคะ?"
          className="text-base p-3"
        />
      </div>
    </div>
  );
};

export default StartPointSection;
