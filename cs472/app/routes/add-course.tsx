import {
  redirect,
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router";
import { authCookie } from "~/utils/session.server";
import CourseRepository from "./repositories/CourseRepository.server";
import TeachRepository from "./repositories/TeachRepository.server";
import { useState, useEffect } from "react";
import TMenuBar from "./components/TMenuBar";
import TeacherCourseCard from "./components/TeacherCourse";


export const loader: LoaderFunction = async ({ request }) => {
  const session = request.headers.get("Cookie");
  const user: AuthCookie = await authCookie.parse(session);
  if (!user) return redirect("/login");
  if (user.role !== "teacher") return redirect("/");
  return { user };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const course_id = formData.get("course_id") as string;
  const course_name = formData.get("course_name") as string;
  const detail = formData.get("detail") as string;

  // console.log("FormData:", { course_id, course_name, detail });

  let errors: Record<string, any> = {};

  const courseRepo = new CourseRepository();
  const existCourseID = await courseRepo.getCourseById(course_id);
  if (existCourseID)
    errors.course_id =
      "The Course ID you entered is already in use. Please try a different one.";

  const existCourseName = await courseRepo.getCourseByName(course_name);
  if (existCourseName)
    errors.course_name =
      "The Course name you entered is already in use. Please try a different one.";

  if (Object.keys(errors).length > 0) {
    //log check errror
    console.log("Errors: ", errors);
    return { errors }; // Return all errors if any exist
  }

  const newCourse = await courseRepo.createCourse(
    course_id,
    course_name,
    detail
  );
  // console.log("New Course: ", newCourse);

  const session = request.headers.get("Cookie");
  const user: AuthCookie = await authCookie.parse(session);

  const teachRepo = new TeachRepository();
  const newTeachRecord = await teachRepo.createTeachRecord(
    user.uuid,
    newCourse.course_id
  );
  // console.log("New Teach Record: ", newTeachRecord);

  return { success: "Create course successful!" };
}

type LoaderData = {
  user: AuthCookie;
};

export default function AddCourse() {
  const fetcher = useFetcher();
  const { user } = useLoaderData<LoaderData>();
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
      <TMenuBar user={user} />

      <div className="bg-[#C0E0FF] h-screen w-screen flex flex-col items-center relative p-4 gap-4">

        <div className="bg-white rounded-2xl p-6 w-full">
        <h1 className="text-2xl font-semibold mb-4 text-center">Create Course</h1>
        <fetcher.Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Course ID</label>
            <input
              name="course_id"
              type="text"
              required
              className="w-full p-2 border rounded bg-blue-50"
            />
            {errors.course_id && (
              <h1 className="text-red-500 text-[12px]">{errors.course_id}</h1>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Course Name</label>
            <input
              name="course_name"
              type="text"
              required
              className="w-full p-2 border rounded bg-blue-50"
            />
            {errors.course_name && (
              <h1 className="text-red-500 text-[12px]">{errors.course_name}</h1>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Detail</label>
            <textarea
              name="detail"
              required
              className="w-full p-2 border rounded bg-blue-50"
            />
          </div>

          {showMessage && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#7793AE] hover:bg-[#43586c] font-semibold text-white py-2 rounded-lg shadow-md"
          >
            Create Course
          </button>
        </fetcher.Form>
        </div>

        <div className="w-full">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <TeacherCourseCard/>
          </div>

        </div>
        
      </div>
    </div>
  );
}
