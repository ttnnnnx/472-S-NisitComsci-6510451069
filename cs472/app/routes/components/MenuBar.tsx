import { Link } from "react-router";
import LogoutButton from "./LogoutButton";

interface MenuBarProps {
  user: {
    name: string;
  };
}

export default function MenuBar({ user }: MenuBarProps) {
  return (
    <div className="w-60 min-w-60 max-w-60 h-screen bg-[#1E364C] text-white flex flex-col justify-between p-4 shadow-lg">
      {/* Username at the top */}
      <div className="text-xl font-bold text-center py-4 border-b border-gray-700">
        {user.name}
      </div>
      
      {/* Navigation Buttons */}
      <nav className="flex flex-col space-y-4 flex-grow mt-4">
        <Link 
        to="/my-course-list" 
        className="px-4 py-2 bg-[#25425d] rounded hover:bg-[#2a4b6a]">My Course</Link>
        <Link 
        to="/review-each-course" 
        className="px-4 py-2 bg-[#25425d] rounded hover:bg-[#2a4b6a]">Review Course</Link>
        <Link to="/exam-schedule" className="px-4 py-2 bg-[#25425d] rounded hover:bg-[#2a4b6a]">Schedule</Link>
      </nav>
      
      <LogoutButton/>
      
      {/* Logout Button */}
      {/* <button className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-500">Logout</button> */}
    </div>
  );
}


