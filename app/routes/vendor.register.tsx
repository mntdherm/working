import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUserFromSession, isVendor } from "~/lib/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);
  
  // If not logged in, redirect to login
  if (!user) {
    return redirect("/auth/login");
  }
  
  // If already a vendor, redirect to vendor dashboard
  if (await isVendor(request)) {
    return redirect("/vendor/dashboard");
  }
  
  return null;
};

// Rest of your existing vendor.register.tsx code remains the same
// ... (keeping existing component code)
