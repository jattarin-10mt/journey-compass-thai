
const UsageInstructions = () => {
  return (
    <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <h4 className="font-semibold text-yellow-800 mb-2">💡 คำแนะนำการใช้งาน:</h4>
      <ul className="text-sm text-yellow-700 space-y-1">
        <li>• กรอกข้อมูลให้ครบทุกช่องก่อนกดบันทึก</li>
        <li>• เลขไมล์ปลายทางต้องมากกว่าหรือเท่ากับเลขไมล์เริ่มต้น</li>
        <li>• ระบบจะคำนวณระยะทางโดยอัตโนมัติ</li>
        <li>• ข้อมูลจะถูกส่งไปบันทึกใน Google Sheets "ข้อมูลการเดินทางรถยนต์"</li>
      </ul>
    </div>
  );
};

export default UsageInstructions;
