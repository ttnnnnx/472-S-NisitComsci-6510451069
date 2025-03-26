import {
  redirect,
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router";
import { authCookie } from "~/utils/session.server";
import CourseRepository from "./repositories/CourseRepository.server";
import MenuBar from "./components/MenuBar";
import TeachRepository from "./repositories/TeachRepository.server";

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

  console.log("FormData:", { course_id, course_name, detail });

  const courseRepo = new CourseRepository();
  const newCourse = await courseRepo.createCourse(
    course_id,
    course_name,
    detail
  );
  console.log("New Course: ", newCourse);

  const session = request.headers.get("Cookie");
  const user: AuthCookie = await authCookie.parse(session);

  const teachRepo = new TeachRepository();
  const newTeachRecord = await teachRepo.createTeachRecord(user.uuid, newCourse.course_id);
  console.log("New Teach Record: ", newTeachRecord);

  return null;
}

type LoaderData = {
  user: AuthCookie;
};

export default function AddCourse() {
  const fetcher = useFetcher();
  const { user } = useLoaderData<LoaderData>();

  return (
    <div className="flex">
      <MenuBar user={user} />

      <div className="bg-slate-300 h-screen w-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold mb-4">Create Course</h1>
        <fetcher.Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Course ID</label>
            <input
              name="course_id"
              type="text"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Course Name</label>
            <input
              name="course_name"
              type="text"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Detail</label>
            <textarea
              name="detail"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Create Course
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
