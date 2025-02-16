import type { MetaFunction } from "@remix-run/node";

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
    </div>
  )
}