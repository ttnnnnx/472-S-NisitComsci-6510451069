import { redirect } from "react-router";
import { getSession } from "./session.server";

export async function requireUserSession({ request }: { request: Request }) {
  const session = await getSession(request);
  const user = session.get("user");

  if (!user) {
    return redirect("/login");
  }

  return {
    message: "",
    user: user,
  };
}
