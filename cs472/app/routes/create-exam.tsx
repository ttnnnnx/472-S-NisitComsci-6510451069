import {
  redirect,
  useFetcher,
  useLoaderData,
  type LoaderFunction,
} from "react-router";
import { authCookie } from "~/utils/session.server";
import MenuBar from "./components/MenuBar";
import TeachRepository from "./repositories/TeachRepository.server";
import CourseRepository from "./repositories/CourseRepository.server";

export const loader: LoaderFunction = async ({ request }) => {
  // ตรวจสอบ session ของผู้ใช้
  const session = request.headers.get("Cookie");
  const user: AuthCookie = await authCookie.parse(session);
  if (!user) return redirect("/login");
  if (user.role !== "teacher") return redirect("/");

  const teachRepo = new TeachRepository();
  const teachs = await teachRepo.getTeachsByUserId(user.uuid);
  console.log("Teachs: ", teachs);

  const courseIds = teachs.map((teach) => teach.course_id);
  console.log("Course IDs:", courseIds);

  const courseRepo = new CourseRepository();
  const courses: Course[] = await courseRepo.getCoursesByIds(courseIds);
  console.log("Courses: ", courses);
  return { user, courses };
};

type LoaderData = {
  user: AuthCookie;
  courses: Course[];
};

export default function CreateExam() {
  const { user, courses } = useLoaderData<LoaderData>();
  // console.log("Courses in page: ",courses);
  const fetcher = useFetcher();

  return (
    <div className="flex">
      <MenuBar user={user} />
      <div className="bg-slate-300 h-screen w-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold mb-4">Create Exam</h1>
        <fetcher.Form method="post" className="flex flex-col gap-5">
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-5">
              <label>Course:</label>
              <label>Exam Date:</label>
              <label>Room:</label>
            </div>

            <div className="flex flex-col gap-5">
              {/* dropdown */}
              <select name="course_id" className="bg-white">
                <option value="">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_id} - {course.course_name}
                  </option>
                ))}
              </select>

              {/* date time input */}
              <input
                type="datetime-local"
                name="exam_date"
                className="bg-white"
                required
              />

              {/* room input */}
              <input type="text" name="room" className="bg-white" required />
            </div>
          </div>

          <button type="submit" className="bg-amber-200 p-2 rounded-xl">
            Create Exam
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
