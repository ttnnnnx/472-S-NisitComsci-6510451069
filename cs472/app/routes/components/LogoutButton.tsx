import { useFetcher } from "react-router";

export default function LogoutButton() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action="/api/logout">
      <button
        type="submit"
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 fixed bottom-5 right-5"
      >
        Logout
      </button>
    </fetcher.Form>
  );
}
