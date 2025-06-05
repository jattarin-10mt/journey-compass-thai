
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

async function handleSubmit() {
  const response = await fetch("https://script.google.com/macros/s/AKfycb.../exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      projectName: "โครงการทดลอง",
      startDateTime: "2025-06-05T08:00:00",
      startLocation: "สำนักงานใหญ่",
      startMileage: 15000,
      endDateTime: "2025-06-05T17:30:00",
      endLocation: "โกดังสินค้า",
      endMileage: 15125
    }) // ✅ วงเล็บปิดของ JSON.stringify()
  }); // ✅ วงเล็บปิดของ fetch()

  const result = await response.text();
  console.log("ผลลัพธ์จาก Google Apps Script:", result);
}

<button onClick={handleSubmit}>เพิ่มข้อมูล</button>


const Index = () => {
  const {
    formData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    validateForm,
    submitToGoogleSheets,
    toast
  } = useTravelForm();

  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('https://script.google.com/macros/s/AKfycbxj_aWX55d9o-dBCpA44KDIMkBuhnuFFBC9KDFUWCJNkakMP-iOkez5sR6lgjoJ9uHajQ/exec');

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

    if (!googleSheetsUrl.trim()) {
      toast({
        title: "กรุณาตรวจสอบข้อมูล",
        description: "กรุณากรอก Google Sheets URL เพื่อบันทึกข้อมูลค่ะ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await submitToGoogleSheets(googleSheetsUrl);
    setIsSubmitting(false);
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
                  startMileage={formData.startMileage}
                  onDateTimeChange={(value) => handleInputChange('startDateTime', value)}
                  onLocationChange={(value) => handleInputChange('startLocation', value)}
                  onMileageChange={(value) => handleInputChange('startMileage', value)}
                />

                <EndPointSection
                  endDateTime={formData.endDateTime}
                  endLocation={formData.endLocation}
                  endMileage={formData.endMileage}
                  onDateTimeChange={(value) => handleInputChange('endDateTime', value)}
                  onLocationChange={(value) => handleInputChange('endLocation', value)}
                  onMileageChange={(value) => handleInputChange('endMileage', value)}
                />
              </div>

              <DistanceDisplay
                distance={formData.distance}
                startMileage={formData.startMileage}
                endMileage={formData.endMileage}
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
