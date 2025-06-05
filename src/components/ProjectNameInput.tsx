
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProjectNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ProjectNameInput = ({ value, onChange }: ProjectNameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="projectName" className="text-lg font-medium text-gray-700">
        📝 ชื่อโครงการ
      </Label>
      <Input
        id="projectName"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="กรุณากรอกชื่อโครงการ"
        className="text-lg p-3"
      />
    </div>
  );
};

export default ProjectNameInput;
