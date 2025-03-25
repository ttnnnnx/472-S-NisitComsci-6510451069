import {
  redirect,
  useFetcher,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router";
import { authCookie } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  // ตรวจสอบ session ของผู้ใช้
//   const session = request.headers.get("Cookie");
//   const user: AuthCookie = await authCookie.parse(session);
//   if (!user || user.role !== "teacher") return redirect("/login");

//   return { user };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const course_id = formData.get("course_id") as string;
  const course_name = formData.get("course_name") as string;
  const detail = formData.get("detail") as string;

  let errors: Record<string, any> = {};

    if(!course_id) errors.course_id = "Please enter course id";

    if(!course_name) errors.course_name = "Please enter course name";

    if(!detail) errors.detail = "Please enter detail";

    if(Object.keys(errors).length > 0) {
        
    }
}

export default function AddCourse() {
  const fetcher = useFetcher();

  return (
    <div className="bg-[#1E364C] h-screen flex flex-col justify-center items-center">
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
  );
}
