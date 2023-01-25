import type { LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node"
import { getSession } from "~/sessions.server";

export const loader = async ({request}: LoaderArgs) => {
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie)
  if (!session.has("token")) {
    // if there is no user session, redirect to login
    throw redirect("/login");
  }

  return json({ hello: "world"});
}