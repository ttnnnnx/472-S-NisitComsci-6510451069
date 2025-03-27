export default function ExamScheduleCard() {
    return (
      <div className="flex items-center bg-white shadow-md rounded-lg p-4 space-x-4">
        {/* Left Section (Day & Time) */}
        <div className="w-32 bg-[#F9E26F] text-black p-4 rounded-lg flex flex-col h-full">
          <div className="font-bold">MON 24 Mar</div>
          <div className="text-lg font-semibold">8:00 - 12:00</div>
        </div>
  
        {/* Right Section (Details) */}
        <div className="flex-grow space-y-2">
          <div className="text-gray-700 font-semibold">01418497-65 </div>
  
          <div className="text-[#0f1d2a] font-bold">Mobile Application Design and Development</div>
  
          <div className="text-gray-700">
            อ.ผู้สอน: <span className="font-medium">อรวรรณ อิ่มสมบัติ</span>
          </div>
  
          <div className="text-gray-600">
            ห้อง: SC45-710
          </div>
  
        </div>
      </div>
    );
  }
  