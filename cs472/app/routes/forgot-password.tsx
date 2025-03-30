import { ArrowLeft } from "lucide-react";
import { Link, useFetcher, type ActionFunctionArgs } from "react-router";

interface ErrorMessage{
    message: string;
    status: number;
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email") as string;

    
}

export default function ForgotPassword(){
    const fetcher = useFetcher<ErrorMessage>();
    return (
        <div className="bg-[#1E364C] h-screen flex flex-col justify-center items-center overflow-auto">
          <fetcher.Form
            method="post"
            className="bg-blue-50 h-fit w-xl p-10 rounded-md flex flex-col gap-3 justify-center items-center shadow-lg"
          >
            <div className="mb-[10px]">
              <h1 className="text-[#1E364C] font-bold text-center text-2xl">
                Forgot your password?
              </h1>
              <h1 className="text-[#9e9898] font-bold text-center">
                Enter your email to reset it!
              </h1>
            </div>

            <div className="w-full justify-start flex flex-col gap-2 ">
              <h1 className="text-[#1E364C] font-bold">Email</h1>
              <input
                name="email"
                type="email"
                className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF] w-full"
                placeholder="Enter your email"
              ></input>
            </div>

            <button
              className="bg-[#7793AE] mt-[10px] text-white p-2 rounded w-full hover:bg-[#43586c] transition-all active:scale-95"
              type="submit"
            >
              Confirm
            </button>

            <Link
              to="/login"
              className="w-full flex flex-row mt-[10px] text-[#1E364C] font-bold hover:font-extrabold"
            >
              <ArrowLeft></ArrowLeft>
              <h1> Return to login page</h1>
            </Link>

          </fetcher.Form>
        </div>
      );
}