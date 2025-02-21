import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { signOut } from "~/models/user.server";
import { getSession, destroySession } from "~/lib/session.server";

export const action: ActionFunction = async ({ request }) => {
  await signOut();
  const session = await getSession(request.headers.get("Cookie"));
  
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
