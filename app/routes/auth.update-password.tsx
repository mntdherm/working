import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { supabase } from "~/lib/supabase.server";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return json({ error: "Kaikki kentät ovat pakollisia" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return json({ error: "Salasanat eivät täsmää" }, { status: 400 });
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) throw error;

    return redirect("/auth/login?passwordUpdated=true");
  } catch (error) {
    return json({ error: "Salasanan päivitys epäonnistui" }, { status: 400 });
  }
};

export default function UpdatePassword() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Aseta uusi salasana
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Syötä ja vahvista uusi salasanasi
          </p>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="text-red-600 text-center">{actionData.error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                Uusi salasana
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Uusi salasana"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Vahvista uusi salasana
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Vahvista uusi salasana"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Päivitä salasana
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
