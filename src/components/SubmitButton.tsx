
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
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
  );
};

export default SubmitButton;
