import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Course } from "@prisma/client";
import CourseRepository from "../../src/repositories/CourseRepository";

export const meta: MetaFunction = () => {
    return [
        { title: "Choose Course to Review" },
        { name: "description", content: "เลือกคอร์สที่ต้องการรีวิว" },
    ];
};

export const loader: LoaderFunction = async () => {
    const courseRepository = new CourseRepository();
    const courses: Course[] = await courseRepository.getAllCourse();
    return json({ courses });
};

export default function ChooseCourseToReview() {
    const { courses } = useLoaderData<{ courses: Course[] }>();

    return (
        <div className="bg-slate-300 min-h-screen p-6">
            <h1 className="text-black font-bold text-2xl mb-6">
                เลือกคอร์สที่ต้องการรีวิว
            </h1>
            <ul className="space-y-4">
                {courses.map((course) => (
                    <li key={course.course_id} className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{course.course_name}</h2>
                        <p className="mt-2">{course.course_detail}</p>
                        <Link to={`/review/${course.course_id}`}> /*ใส่ไว้ชั่วคราว ลิงค์ไปหน้า review ของแต่ละวิชา*/
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
                                รีวิวคอร์สนี้
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}