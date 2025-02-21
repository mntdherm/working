import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link, useSearchParams } from "@remix-run/react";
import { signIn } from "~/models/user.server";
import { getSession, commitSession } from "~/lib/session.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("accessToken")) {
    return redirect("/");
  }
  return null;
};

// Temporary test accounts
const TEST_ACCOUNTS = {
  vendor: {
    email: "vendor@test.com",
    password: "test123",
    role: "vendor"
  },
  user: {
    email: "user@test.com",
    password: "test123",
    role: "user"
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const loginType = formData.get("loginType");

  if (!email || !password) {
    return json(
      { error: "Sähköposti ja salasana ovat pakollisia" },
      { status: 400 }
    );
  }

  try {
    // For testing purposes, check if using test accounts
    let testAccount = null;
    if (email === TEST_ACCOUNTS.vendor.email && password === TEST_ACCOUNTS.vendor.password) {
      testAccount = TEST_ACCOUNTS.vendor;
    } else if (email === TEST_ACCOUNTS.user.email && password === TEST_ACCOUNTS.user.password) {
      testAccount = TEST_ACCOUNTS.user;
    }

    let authResult;
    if (testAccount) {
      // Mock authentication for test accounts
      authResult = {
        accessToken: `test_token_${testAccount.role}`,
        user: {
          id: `test_${testAccount.role}_id`,
          email: testAccount.email,
          role: testAccount.role,
          created_at: new Date().toISOString()
        }
      };
    } else {
      // Regular authentication
      authResult = await signIn({ email, password });
    }
    
    const session = await getSession(request.headers.get("Cookie"));
    session.set("accessToken", authResult.accessToken);

    // Redirect vendors to vendor dashboard
    const redirectTo = authResult.user.role === 'vendor' ? "/vendor" : "/";

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return json(
      { error: "Virheellinen sähköposti tai salasana" },
      { status: 401 }
    );
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const vendorAccessError = searchParams.get("error") === "vendor_access_required";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Kirjaudu sisään
          </h2>
          {vendorAccessError && (
            <div className="mt-2 text-center text-sm text-red-600">
              Tämä sivu on vain palveluntarjoajille
            </div>
          )}
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800">Test Accounts:</h3>
          <ul className="mt-2 text-sm text-yellow-700">
            <li>Vendor: vendor@test.com / test123</li>
            <li>User: user@test.com / test123</li>
          </ul>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Sähköposti
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Sähköposti"
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
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Salasana"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/auth/reset-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Unohditko salasanasi?
              </Link>
            </div>
          </div>

          {actionData?.error && (
            <div className="text-red-600 text-sm">{actionData.error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kirjaudu sisään
            </button>
          </div>
        </Form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Eikö sinulla ole tiliä?{" "}
            <Link
              to="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Rekisteröidy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
