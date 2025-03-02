import { redirect, useFetcher, type ActionFunctionArgs } from "react-router";
import { authCookie } from "~/utils/session.server";
import UserRepository from "./repositories/UserRepository.server";

interface ActionMessage {
  message: string;
  error: string;
  data: any;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  switch (action) {
    case "login":
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      if (!email || !password) {
        return {
          message: "",
          error: "Invalid username or password",
          data: null,
        };
      }
      const userRepo = new UserRepository();
      const user = await userRepo.login(email, password);
      if (user.error) {
        return {
          message: "",
          error: "Invalid username or password",
          data: null,
        };
      }
      const authCookieUser: AuthCookie = {
        uuid: user.user.uuid,
        name: user.user.name,
        surname: user.user.surname,
        email: user.user.email,
        year: user.user.year,
        role: user.user.role,
      };
      return redirect("/", {
        headers: {
          "Set-Cookie": await authCookie.serialize(authCookieUser),
        },
      });
    case "logout":
      break;
    default:
      return { message: "", error: "Invalid action", data: null };
  }
}

export default function Login() {
  const fetcher = useFetcher<ActionMessage>();
  return (
    <fetcher.Form
      method="post"
      className="flex flex-col justify-center items-center w-svw h-svh mt-4 space-y-4"
    >
      <input
        type="text"
        name="email"
        placeholder="Email"
        className="border border-gray-300 p-2"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border border-gray-300 p-2"
      />
      {fetcher.data?.error && (
        <div className="text-red-500">{fetcher.data.error}</div>
      )}
      <button
        name="_action"
        value="login"
        className="bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>
    </fetcher.Form>
  );
}
