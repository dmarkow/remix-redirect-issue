import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions.server";

export const loader = async () => {
  return json({ status: "logged_out" });
};
export const action = async ({ request }: ActionArgs) => {
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  session.set("token", "logged_in");
  const result = await commitSession(session);
  return redirect("/", {
    headers: {
      "Set-Cookie": result,
    },
  });
};

export default function Login() {
  return (
    <Form method="post">
      <button>Log In</button>
    </Form>
  );
}
