import { json } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { supabase } from "~/lib/supabase.server";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();

  if (!email) {
    return json({ error: "Sähköpostiosoite vaaditaan" }, { status: 400 });
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.APP_URL}/auth/update-password`,
    });

    if (error) throw error;

    return json({
      success: "Salasanan palautuslinkki on lähetetty sähköpostiisi",
    });
  } catch (error) {
    return json({ error: "Salasanan palautus epäonnistui" }, { status: 400 });
  }
};

export default function ResetPassword() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Palauta salasana
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Syötä sähköpostiosoitteesi saadaksesi palautuslinkin
          </p>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="text-red-600 text-center">{actionData.error}</div>
          )}
          {actionData?.success && (
            <div className="text-green-600 text-center">{actionData.success}</div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">
              Sähköpostiosoite
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Sähköpostiosoite"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lähetä palautuslinkki
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Takaisin kirjautumiseen
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
