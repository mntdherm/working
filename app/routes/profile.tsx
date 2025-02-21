import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/lib/auth.server";
import { supabase } from "~/lib/supabase.server";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const phone = formData.get("phone")?.toString();

  try {
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        name,
        phone,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    return json({ success: "Profiili päivitetty onnistuneesti" });
  } catch (error) {
    return json({ error: "Profiilin päivitys epäonnistui" }, { status: 400 });
  }
};

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Profiili
            </h1>

            <Form method="post" className="space-y-6">
              {actionData?.error && (
                <div className="text-red-600">{actionData.error}</div>
              )}
              {actionData?.success && (
                <div className="text-green-600">{actionData.success}</div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sähköposti
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    disabled
                    value={user.email}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nimi
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={user.user_metadata?.name}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Puhelinnumero
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    defaultValue={user.user_metadata?.phone}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Tallenna muutokset
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
