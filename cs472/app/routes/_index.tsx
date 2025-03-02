import { Link, redirect, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { authCookie } from "~/utils/session.server";


export const meta: MetaFunction = () => {
  return [
    { title: "Nisit Com Sci" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({request}: LoaderFunctionArgs) {
  const session = request.headers.get("Cookie");
  const user : AuthCookie = await authCookie.parse(session);
  if (!user) return redirect("/login");
  return {user};
}

export default function Index() {
  const {user} = useLoaderData<typeof loader>();
  return (
    <div className="bg-slate-300 h-screen flex flex-col justify-center items-center">
      <h1 className="text-black font-bold text-2xl">
        Welcome {user.name} {user.surname}! to Nisit Com Sci
      </h1>
      <Link to="/choose-course-to-review">
        <button className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
          Choose Course to Review
        </button>
      </Link>
    </div>
  );
}