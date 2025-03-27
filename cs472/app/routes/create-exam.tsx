import {
  redirect,
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router";
import { authCookie } from "~/utils/session.server";
import MenuBar from "./components/MenuBar";
import TeachRepository from "./repositories/TeachRepository.server";
import CourseRepository from "./repositories/CourseRepository.server";
import ExamRepository from "./repositories/ExamRepository.server";
import { useState, useEffect } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = request.headers.get("Cookie");
  const user: AuthCookie = await authCookie.parse(session);
  if (!user) return redirect("/login");
  if (user.role !== "teacher") return redirect("/");

  const teachRepo = new TeachRepository();
  const teachs = await teachRepo.getTeachsByUserId(user.uuid);
  // console.log("Teachs: ", teachs);

  const courseIds = teachs.map((teach) => teach.course_id);
  // console.log("Course IDs:", courseIds);

  const courseRepo = new CourseRepository();
  const courses: Course[] = await courseRepo.getCoursesListByIds(courseIds);
  // console.log("Courses: ", courses);
  return { user, courses };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const course_id = formData.get("course_id") as string;
  const start_time = new Date(formData.get("start_time") as string);
  const end_time = new Date(formData.get("end_time") as string);
  const room = formData.get("room") as string;

  console.log("Form Data: ", { course_id, start_time, end_time, room });

  let errors: Record<string, any> = {};

  // if (!course_id) errors.course_id = "Please select a course.";
  // if (!start_time) errors.start_time = "Start time is required.";
  // if (!end_time) errors.end_time = "End time is required.";
  // if (!room) errors.room = "Room is required.";

  const examRepo = new ExamRepository();
  const conflict = await examRepo.checkExamConflict(room, start_time, end_time);
  if (conflict)
    errors.conflict = "This room is already booked for the selected time.";

  if (Object.keys(errors).length > 0) {
    //log check errror
    console.log("Errors: ", errors);
    return { errors }; // Return all errors if any exist
  }

  try {
    const newExam = await examRepo.createExam(
      course_id,
      start_time,
      end_time,
      room
    );
    console.log("New Exam: ", newExam);
    return { success: "Exam created successful!" };
  } catch (error) {
    return { errors: { database: "Failed to create exam. Please try again." } };
  }
}

type LoaderData = {
  user: AuthCookie;
  courses: Course[];
};

export default function CreateExam() {
  const { user, courses } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors || {};
  const successMessage = fetcher.data?.success || "";

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (successMessage) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  }, [successMessage]);

  return (
    <div className="flex">
      <MenuBar user={user} />
      <div className="bg-[#C0E0FF] h-screen w-screen flex flex-col justify-center items-center">
        <fetcher.Form
          method="post"
          className="flex flex-col gap-5 bg-white items-center rounded p-3 shadow-2xl"
        >
          <h1 className="text-2xl font-semibold mb-4">Create Exam</h1>
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-5">
              <label>Course:</label>
              <label>Start Date and Time:</label>
              <label>End Date and Time:</label>
              <label>Room:</label>
            </div>

            <div className="flex flex-col gap-5">
              <select
                name="course_id"
                className="bg-white border rounded"
                required
              >
                <option value="">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_id} - {course.course_name}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                name="start_time"
                className="bg-white border rounded"
                required
              />

              <input
                type="datetime-local"
                name="end_time"
                className="bg-white border rounded"
                required
              />

              <input
                type="text"
                name="room"
                className="bg-white border rounded"
                required
              />
            </div>
          </div>

          {showMessage && (
            <div className="text-green-400 text-[12px]">
              {successMessage}
            </div>
          )}

          {errors.conflict && (
            <h1 className="text-red-500 text-[12px]">{errors.conflict}</h1>
          )}

          <button
            type="submit"
            className="w-full bg-[#7793AE] hover:bg-[#43586c] font-semibold text-white py-2 rounded-lg shadow-md"
          >
            Create Exam
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
