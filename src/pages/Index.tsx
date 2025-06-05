import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTravelForm } from '@/hooks/useTravelForm';
import TravelFormHeader from '@/components/TravelFormHeader';
import GoogleSheetsUrlInput from '@/components/GoogleSheetsUrlInput';
import ProjectNameInput from '@/components/ProjectNameInput';
import StartPointSection from '@/components/StartPointSection';
import EndPointSection from '@/components/EndPointSection';
import DistanceDisplay from '@/components/DistanceDisplay';
import SubmitButton from '@/components/SubmitButton';
import UsageInstructions from '@/components/UsageInstructions';

const Index: React.FC = () => {
  const {
    formData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    validateForm,
    submitToGoogleSheets,
    toast,
  } = useTravelForm();

  const [googleSheetsUrl, setGoogleSheetsUrl] = useState<string>(
    'https://script.google.com/macros/s/AKfycbxj_aWX55d9o-dBCpA44KDIMkBuhnuFFBC9KDFUWCJNkakMP-iOkez5sR6lgjoJ9uHajQ/exec'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: 'กรุณาตรวจสอบข้อมูล',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    if (!googleSheetsUrl.trim()) {
      toast({
        title: 'กรุณาตรวจสอบข้อมูล',
        description: 'กรุณากรอก Google Sheets URL เพื่อบันทึกข้อมูลค่ะ',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await submitToGoogleSheets(googleSheetsUrl);
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งข้อมูลไปยัง Google Sheets ได้',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <TravelFormHeader />

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <GoogleSheetsUrlInput
                googleSheetsUrl={googleSheetsUrl}
                setGoogleSheetsUrl={setGoogleSheetsUrl}
              />

              <ProjectNameInput
                value={formData.projectName}
                onChange={(value) => handleInputChange('projectName', value)}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <StartPointSection
                  startDateTime={formData.startDateTime}
                  startLocation={formData.startLocation}
                  startMileage={formData.startOdometer}
                  onDateTimeChange={(value) =>
                    handleInputChange('startDateTime', value)
                  }
                  onLocationChange={(value) =>
                    handleInputChange('startLocation', value)
                  }
                  onMileageChange={(value) =>
                    handleInputChange('startOdometer', value)
                  }
                />

                <EndPointSection
                  endDateTime={formData.endDateTime}
                  endLocation={formData.endLocation}
                  endMileage={formData.endOdometer}
                  onDateTimeChange={(value) =>
                    handleInputChange('endDateTime', value)
                  }
                  onLocationChange={(value) =>
                    handleInputChange('endLocation', value)
                  }
                  onMileageChange={(value) =>
                    handleInputChange('endOdometer', value)
                  }
                />
              </div>

              <DistanceDisplay
                distance={formData.distance}
                startMileage={formData.startOdometer}
                endMileage={formData.endOdometer}
              />

              <SubmitButton isSubmitting={isSubmitting} />
            </form>

            <UsageInstructions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
