import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { signUp } from "~/models/user.server";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!email || !password || !confirmPassword) {
    return json({ error: "Kaikki kentät ovat pakollisia" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return json({ error: "Salasanat eivät täsmää" }, { status: 400 });
  }

  try {
    await signUp(email, password);
    return redirect("/auth/login?registered=true");
  } catch (error) {
    return json({ error: "Rekisteröinti epäonnistui" }, { status: 400 });
  }
};

export default function SignUp() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Luo uusi tili
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tai{" "}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              kirjaudu sisään olemassa olevalla tilillä
            </Link>
          </p>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="text-red-600 text-center">{actionData.error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Sähköpostiosoite
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Sähköpostiosoite"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Salasana
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Salasana"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Vahvista salasana
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Vahvista salasana"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Rekisteröidy
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
