import {
  Link,
  redirect,
  useFetcher,
  type ActionFunctionArgs,
} from "react-router";
import UserRepository from "./repositories/UserRepository.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const year = Number(formData.get("year"));
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: Record<string, string> = {};

  if (!firstName || firstName.length < 2 || firstName.length > 15)
    errors.firstName = "First name should contain 2-15 characters";

  if (!lastName || lastName.length < 2 || lastName.length > 15)
    errors.lastName = "Last name should contain 2-15 characters";

  if (!year || year < 1 || year > 8)
    errors.year = "Year must be between 1 and 8";

  if (!email) errors.email = "Please input email";

  if (!password) errors.password = "Please input your password";

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    console.log("Errors: ", errors);
    return { errors }; // Return all errors if any exist
  }

  const userRepo = new UserRepository();
  const existUser = await userRepo.getUserByEmail(email);

  if (existUser) {
    return { email: "Email already used" };
  }

  const response = await userRepo.createUser(
    firstName,
    lastName,
    password,
    email,
    year
  );

  if (response) {
    return redirect("/login");
  }

  return null;
}

export default function Register() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors || {};

  return (
    <div className="bg-[#1E364C] h-screen flex flex-col justify-center items-center">
      <fetcher.Form
        method="post"
        action="/register"
        className="bg-blue-50 h-fit w-fit p-5 px-10 rounded-md shadow-lg flex flex-col justify-center items-center gap-4"
      >
        <h1 className="text-[#1E364C] font-extrabold text-3xl">Register</h1>

        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]"
        ></input>
        {errors.firstName && (
          <h1 className="text-red-500">{errors.firstName}</h1>
        )}
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]"
        ></input>
        {errors.lastName && <h1 className="text-red-500">{errors.lastName}</h1>}
        <input
          name="year"
          type="number"
          placeholder="year"
          className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]"
        ></input>
        {errors.year && <h1 className="text-red-500">{errors.year}</h1>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]"
        ></input>
        {errors.email && <h1 className="text-red-500">{errors.email}</h1>}
        <input
          name="password"
          type="password"
          placeholder="password"
          className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]"
        ></input>
        {errors.password && <h1 className="text-red-500">{errors.password}</h1>}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]"
        ></input>
        {errors.confirmPassword && (
          <h1 className="text-red-500">{errors.confirmPassword}</h1>
        )}
        <button
          className="bg-[#7793AE] text-white p-2 rounded w-40 hover:bg-[#43586c]"
          type="submit"
        >
          create account
        </button>
        <div className="flex flex-row gap-2">
          <h1 className="text-[#1E364C] text-[12px]">
            Already have an account?
          </h1>
          <Link
            to="/login"
            prefetch="render"
            className="text-[#1E364C] underline font-bold hover:font-extrabold text-[12px]"
          >
            LogIn
          </Link>
        </div>
      </fetcher.Form>
    </div>
  );
}
