import { Outlet } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getUserFromSession } from "~/lib/auth.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);
  
  if (!user) {
    throw redirect("/auth/login");
  }
  
  return json({ user });
};

export default function ProtectedLayout() {
  return <Outlet />;
}
