
interface DistanceDisplayProps {
  distance: number;
  startMileage: number;
  endMileage: number;
}

const DistanceDisplay = ({ distance, startMileage, endMileage }: DistanceDisplayProps) => {
  if (distance <= 0) return null;

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">
          📏 ระยะทางการเดินทาง
        </h3>
        <p className="text-2xl font-bold text-blue-600">
          {distance.toFixed(1)} กิโลเมตร
        </p>
        <p className="text-gray-600 mt-1">
          คำนวณจาก: {endMileage} - {startMileage} = {distance.toFixed(1)} กม.
        </p>
      </div>
    </div>
  );
};

export default DistanceDisplay;
