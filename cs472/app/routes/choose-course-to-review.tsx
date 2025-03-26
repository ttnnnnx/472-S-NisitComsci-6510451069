<<<<<<< HEAD
// ChooseCourseToReview.tsx
import { Link, useLoaderData, type LoaderFunction, type MetaFunction } from "react-router";
=======
import { Link, redirect, useLoaderData, type LoaderFunction, type MetaFunction } from "react-router";
>>>>>>> 5831770c680aa630bedc03063f4a10f6ba754515
import CourseRepository from "./repositories/CourseRepository.server";
import MenuBar from "./components/MenuBar";
import { authCookie } from "~/utils/session.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Choose Course to Review" },
        { name: "description", content: "เลือกคอร์สที่ต้องการรีวิว" },
    ];
};

export const loader: LoaderFunction = async ({request}) => {
    const session = request.headers.get("Cookie");
    const user : AuthCookie = await authCookie.parse(session);
    if (!user) return redirect("/login");
    const courseRepository = new CourseRepository();
    const courses: Course[] = await courseRepository.getAllCourse();

    return {user, courses};
};

export default function ChooseCourseToReview() {
    const { user } = useLoaderData<{user: User}>();
    const { courses } = useLoaderData<{ courses: Course[] }>();
    // const {user} = useLoaderData<LoaderData>();

    return (
<<<<<<< HEAD
        <div className="bg-slate-300 min-h-screen p-6 relative">
            <LogoutButton />
            {/* ปุ่มสำหรับไปยังหน้าของ SectionFormPage */}
            <div className="absolute top-6 right-6 space-x-4">
                <Link to="/my-course-list">
                    <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition">
                        Choose Your Course
                    </button>
                </Link>
                <Link to="/section-form">
                    <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
                        ไปยังหน้า Section Form
                    </button>
                </Link>
            </div>
=======
        <div className="flex">
            <MenuBar user={user}/>
        <div className="bg-[#C0E0FF] h-screen w-screen p-6 relative ">
>>>>>>> 5831770c680aa630bedc03063f4a10f6ba754515

            <h1 className="text-[#0f1d2a] font-bold text-2xl mb-6">
                Choose Course To Review
            </h1>

            {/* กล่อง Scrollable สำหรับรายชื่อคอร์ส */}
            <div className="bg-white p-4 rounded-lg shadow-lg max-h-[800px] overflow-y-auto border border-gray-300">
                <ul className="space-y-4">
                    {courses.map((course) => (
                        <li key={course.course_id} className="bg-gray-100 p-4 rounded shadow">
                            <h2 className="text-xl font-semibold">{course.course_name}</h2>
                            <p className="mt-2">{course.course_detail}</p>
                            <Link to={`/review-each-course?course_id=${course.course_id}`}>
                                <button className="mt-4 px-4 py-2 bg-[#7793AE] text-white font-semibold rounded-lg shadow-md hover:bg-[#43586c] transition">
                                    create review
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </div>
    );
}
