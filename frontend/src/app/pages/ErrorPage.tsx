import { Link, isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message || "Unable to load this page.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Error</p>
      <h1 className="mt-6 text-4xl font-bold text-slate-900">{title}</h1>
      <p className="mt-4 text-base text-slate-600">{message}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          to="/"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
