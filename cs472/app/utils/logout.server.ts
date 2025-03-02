import { redirect } from "react-router";
import { destroySession, getSession } from "./session.server";

export async function logout({ request }: { request: Request }) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}