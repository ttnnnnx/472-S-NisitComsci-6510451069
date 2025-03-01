import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import type { Course } from "@prisma/client";

// Import repository โดยใช้ path ให้ถูกต้อง
import CourseRepository from "../../src/repositories/CourseRepository";
import EnrollmentRepository from "../../src/repositories/EnrollmentRepository";
//getUserSession(ไม่รู้ทำไง)
import { getUserSession } from "~/utils/session.server";

type LoaderData = {
    allCourses: Course[];
    enrolledCourseIds: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
    // ตรวจสอบ session ของผู้ใช้
    const session = await getUserSession(request);
    if (!session) return redirect("/login");

    const courseRepo = new CourseRepository();
    const enrollmentRepo = new EnrollmentRepository();

    // ดึงข้อมูลคอร์สทั้งหมดจากฐานข้อมูล
    const allCourses = await courseRepo.getAllCourse();
    // ใช้ userId จาก sessionดึง Enrollment ปัจจุบัน
    const enrollments = await enrollmentRepo.getEnrollmentsByUser(session.userId);
    const enrolledCourseIds = enrollments.map((e) => e.course_id);

    return json<LoaderData>({ allCourses, enrolledCourseIds });
};

export const action: ActionFunction = async ({ request }) => {
    const session = await getUserSession(request);
    if (!session) return redirect("/login");

    const formData = await request.formData();
    // รับค่าจาก checkbox ที่มี name="courseIds"
    const courseIds = formData.getAll("courseIds") as string[];

    const enrollmentRepo = new EnrollmentRepository();
    await enrollmentRepo.updateEnrollments(session.userId, courseIds);

    return redirect("/my-course-list");
};

export default function MyCourseList() {
    const { allCourses, enrolledCourseIds } = useLoaderData<LoaderData>();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">My Course List</h1>
            <Form method="post" className="mt-4 space-y-4">
                <ul className="space-y-2">
                    {allCourses.map((course) => {
                        const isChecked = enrolledCourseIds.includes(course.course_id);
                        return (
                            <li key={course.course_id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="courseIds"
                                    value={course.course_id}
                                    defaultChecked={isChecked}
                                    id={`course_${course.course_id}`}
                                />
                                <label htmlFor={`course_${course.course_id}`}>
                                    {course.course_name}
                                </label>
                            </li>
                        );
                    })}
                </ul>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    บันทึก
                </button>
            </Form>
        </div>
    );
}
