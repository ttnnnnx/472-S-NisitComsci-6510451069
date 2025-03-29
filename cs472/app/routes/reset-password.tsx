import { useFetcher } from "react-router";

export default function ResetPassword() {
  const fetcher = useFetcher();

  return (
    <div className="bg-[#1E364C] h-screen flex flex-col justify-center items-center overflow-auto">
      <fetcher.Form
        method="post"
        className="bg-blue-50 h-fit w-xl p-10 rounded-md flex flex-col gap-3 justify-center items-center shadow-lg"
      >
        <div className="mb-[10px]">
          <h1 className="text-[#1E364C] font-bold text-center text-2xl">
            Reset password
          </h1>
          <h1 className="text-[#9e9898] font-bold text-center text-[12px]">
            please kindly set your new password
          </h1>
        </div>

        <div className="w-full justify-start flex flex-col gap-2">
          <h1 className="text-[#1E364C] font-bold">New Password</h1>
          <input
            name="password"
            type="password"
            className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF] w-full"
            placeholder="Your new password"
          ></input>
        </div>

        <div className="w-full justify-start flex flex-col gap-2">
          <h1 className="text-[#1E364C] font-bold">Re-enter password</h1>
          <input
            name="password"
            type="password"
            className="border border-gray-300 p-2 text-[#1E364C] bg-[#FFFFFF] w-full"
            placeholder="Re-enter your password"
          ></input>
        </div>

        <button
          className="bg-[#7793AE] mt-[10px] text-white p-2 rounded w-full hover:bg-[#43586c] transition-all active:scale-95"
          type="submit"
        >
          Confirm
        </button>
      </fetcher.Form>
    </div>
  );
}
