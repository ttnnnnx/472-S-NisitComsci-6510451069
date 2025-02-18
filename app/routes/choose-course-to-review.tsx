import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";

export default function ChooseCourseToReview() {
    const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        fetch("/api/courses") // เรียก API เพื่อนำข้อมูลมาใช้
            .then((res) => res.json())
            .then((data) => setCourses(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="bg-gray-200 h-screen flex flex-col justify-center items-center">
            <h1 className="text-black font-bold text-2xl mb-4">
                Choose a Course to Review
            </h1>
            <div className="bg-white w-96 h-60 overflow-y-scroll border rounded-lg shadow-lg p-4">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.id} className="p-2 border-b">
                            {course.name}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No courses available</p>
                )}
            </div>
            <Link to="/">
                <button className="mt-4 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md">
                    Back to Home
                </button>
            </Link>
        </div>
    );
}
