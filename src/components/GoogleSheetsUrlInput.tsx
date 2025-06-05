
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface GoogleSheetsUrlInputProps {
  googleSheetsUrl: string;
  setGoogleSheetsUrl: (url: string) => void;
}

const GoogleSheetsUrlInput = ({ googleSheetsUrl, setGoogleSheetsUrl }: GoogleSheetsUrlInputProps) => {
  return (
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
  );
};

export default GoogleSheetsUrlInput;
