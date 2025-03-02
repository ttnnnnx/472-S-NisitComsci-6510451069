//getUserSession(ไม่รู้ทำไง)

import {
  Form,
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  type ActionFunction,
  type LoaderFunction,
} from "react-router";
import CourseRepository from "./repositories/CourseRepository.server";
import EnrollmentRepository from "./repositories/EnrollmentRepository.server";
import { authCookie } from "~/utils/session.server";
import LogoutButton from "./components/LogoutButton";

type LoaderData = {
  allCourses: Course[];
  enrolledCourseIds: string[];
  user: AuthCookie;
};

export const loader: LoaderFunction = async ({ request }) => {
  // ตรวจสอบ session ของผู้ใช้
  const session = request.headers.get("Cookie");
  const user: AuthCookie = await authCookie.parse(session);
  if (!user) return redirect("/login");
  const courseRepo = new CourseRepository();
  const enrollmentRepo = new EnrollmentRepository();
  // ดึงข้อมูลคอร์สทั้งหมดจากฐานข้อมูล
  const allCourses: Course[] = await courseRepo.getAllCourse();
  // ใช้ userId จาก sessionดึง Enrollment ปัจจุบัน
  const enrollments = await enrollmentRepo.getEnrollmentsByUser(user.uuid);

  const enrolledCourseIds = enrollments.map((e) => e.course_id);

  return { user, allCourses, enrolledCourseIds };
};

export const action: ActionFunction = async ({ request }) => {
  const session = request.headers.get("Cookie");
  const user: AuthCookie = await authCookie.parse(session);
  if (!user) return redirect("/login");

  const formData = await request.formData();
  const action = formData.get("_action") as string;
  switch (action) {
    case "updateEnrollments":
      const courseIds = formData.getAll("courseIds") as string[];
      const enrollmentRepo = new EnrollmentRepository();
      const message = await enrollmentRepo.updateEnrollments(
        user.uuid,
        courseIds
      );
      return { message: message.message, error: "", data: null };
    default:
      return { message: "", error: "Action not found", data: null };
  }
};

interface ActionMessage {
  message: string;
  error: string;
  data: any;
}

export default function MyCourseList() {
  const { user, allCourses, enrolledCourseIds } = useLoaderData<LoaderData>();
  const fetcher = useFetcher<ActionMessage>();

  return (
    <div className="p-4">
      <LogoutButton />
      <h1 className="text-2xl font-bold">{user.name} Course List</h1>
      <fetcher.Form method="post" className="mt-4 space-y-4">
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
        {fetcher.data?.message && (
          <p className="text-green-500">{fetcher.data.message}</p>
        )}
        {fetcher.data?.error && (
          <p className="text-red-500">{fetcher.data.error}</p>
        )}
        <Link to="/choose-course-to-review">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-1">
            กลับ
          </button>
        </Link>
        <button
          type="submit"
          name="_action"
          value="updateEnrollments"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          บันทึก
        </button>
      </fetcher.Form>
    </div>
  );
}
