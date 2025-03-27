import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import MenuBar from "./components/MenuBar";
import { authCookie } from "~/utils/session.server";
import ExamScheduleCard from "./components/ExamScheduleCard";

export async function loader({request}: LoaderFunctionArgs) {
    const session = request.headers.get("Cookie");
    const user : AuthCookie = await authCookie.parse(session);
    if (!user) return redirect("/login");
    return {user};
  }

export default function ExamSchedule() {
    const {user} = useLoaderData<typeof loader>();
    return (
        <div className="flex">
            <MenuBar user={user}/>
            <div className="bg-[#C0E0FF] h-screen w-screen p-6 relative">
                <h1 className="text-[#0f1d2a] font-bold text-2xl mb-6">
                    Exam Schedule
                </h1>

                <main className="p-4">
                    <ExamScheduleCard/>
                </main>

            </div>
        </div>
    );


}