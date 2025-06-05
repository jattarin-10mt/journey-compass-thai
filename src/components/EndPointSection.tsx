
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EndPointSectionProps {
  endDateTime: string;
  endLocation: string;
  endMileage: number;
  onDateTimeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onMileageChange: (value: number) => void;
}

const EndPointSection = ({
  endDateTime,
  endLocation,
  endMileage,
  onDateTimeChange,
  onLocationChange,
  onMileageChange
}: EndPointSectionProps) => {
  return (
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
          value={endDateTime}
          onChange={(e) => onDateTimeChange(e.target.value)}
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
          value={endLocation}
          onChange={(e) => onLocationChange(e.target.value)}
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
          value={endMileage || ''}
          onChange={(e) => onMileageChange(Number(e.target.value))}
          placeholder="เลขไมล์ตอนถึงปลายทางคือ?"
          className="text-base p-3"
        />
      </div>
    </div>
  );
};

export default EndPointSection;
