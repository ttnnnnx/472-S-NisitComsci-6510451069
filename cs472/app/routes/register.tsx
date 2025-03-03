import { Link, useFetcher, useLoaderData } from "react-router";

interface ErrorMessage {
    message: string;
    status: string;
}

export default function Register() {
    const fetcher = useFetcher<ErrorMessage>();

    return (
        <div className="bg-[#1E364C] h-screen flex flex-col justify-center items-center">
            <fetcher.Form className="bg-blue-50 h-fit w-fit p-5 px-10 rounded-md shadow-lg flex flex-col justify-center items-center gap-4">
                <h1 className="text-[#1E364C] font-extrabold text-3xl">
                    Register
                </h1>
                <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]">
                </input>
                {
                    fetcher.data?.message && (
                        <h1 className="text-red-500">
                            {fetcher.data.message}
                        </h1>
                    )
                }
                <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]">
                </input>
                {
                    fetcher.data?.message && (
                        <h1 className="text-red-500">
                            {fetcher.data.message}
                        </h1>
                    )
                }
                <input
                    name="year"
                    type="number"
                    placeholder="year"
                    className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]">
                </input>
                {
                    fetcher.data?.message && (
                        <h1 className="text-red-500">
                            {fetcher.data.message}
                        </h1>
                    )
                }
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]">
                </input>
                {
                    fetcher.data?.message && (
                        <h1 className="text-red-500">
                            {fetcher.data.message}
                        </h1>
                    )
                }
                <input
                    name="password"
                    type="password"
                    placeholder="password"
                    className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]">
                </input>
                {
                    fetcher.data?.message && (
                        <h1 className="text-red-500">
                            {fetcher.data.message}
                        </h1>
                    )
                }
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF]">
                </input>
                {
                    fetcher.data?.message && (
                        <h1 className="text-red-500">
                            {fetcher.data.message}
                        </h1>
                    )
                }
                <button
                    className="bg-[#7793AE] text-white p-2 rounded w-40 hover:bg-[#43586c]"
                    type="submit"
                >
                    create account
                </button>
                <div className="flex flex-row gap-2">
                    <h1 className="text-[#1E364C] text-[12px]">Already have an account?</h1>
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