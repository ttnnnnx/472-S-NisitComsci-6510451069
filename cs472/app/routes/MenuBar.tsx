import { Link } from "react-router";


interface MenuBarProps {
  username: string;
}

export default function MenuBar({ username }: MenuBarProps) {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col justify-between p-4 shadow-lg">
      {/* Username at the top */}
      <div className="text-xl font-bold text-center py-4 border-b border-gray-700">
        {username}
      </div>
      
      {/* Navigation Buttons */}
      <nav className="flex flex-col space-y-4 flex-grow mt-4">
        <Link to="/my-course" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">My Course</Link>
        <Link to="/review-course" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Review Course</Link>
        <Link to="/schedule" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Schedule</Link>
      </nav>
      
      {/* Logout Button */}
      <button className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-500">Logout</button>
    </div>
  );
}


