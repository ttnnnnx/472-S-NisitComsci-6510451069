import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import MenuBar from "./components/MenuBar";
import { authCookie } from "~/utils/session.server";

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
            <div className="h-screen w-screen bg-blue-200">

            </div>
        </div>
    )


}