import { Outlet } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { requireVendor } from "~/lib/auth.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const vendor = await requireVendor(request);
  return json({ vendor });
};

export default function VendorLayout() {
  return <Outlet />;
}
