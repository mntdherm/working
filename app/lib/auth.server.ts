import { redirect } from "@remix-run/node";
import { getSession } from "./session.server";
import { getUser } from "~/models/user.server";
import type { User } from "~/types";

export async function requireUser(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("accessToken");

  if (!accessToken) {
    throw redirect("/auth/login");
  }

  try {
    const user = await getUser(accessToken);
    if (!user) throw new Error("No user found");
    return user;
  } catch (error) {
    throw redirect("/auth/login");
  }
}

export async function requireVendor(request: Request) {
  const user = await getUserFromSession(request);
  
  if (!user) {
    throw redirect("/auth/login");
  }

  if (user.role !== 'vendor') {
    throw redirect("/auth/login?error=vendor_access_required");
  }

  return user;
}

export async function getUserFromSession(request: Request): Promise<User | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("accessToken");

  if (!accessToken) {
    return null;
  }

  try {
    return await getUser(accessToken);
  } catch (error) {
    return null;
  }
}

export async function isVendor(request: Request): Promise<boolean> {
  const user = await getUserFromSession(request);
  return user?.role === 'vendor';
}
