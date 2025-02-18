import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Nisit Com Sci" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="bg-slate-300 h-screen flex flex-col justify-center items-center">
      <h1 className="text-black font-bold text-2xl">
        Welcome to Nisit Com Sci
      </h1>
      <Link to="/choose-course-to-review">
        <button className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
          Choose Course to Review
        </button>
      </Link>
    </div>
  );
}