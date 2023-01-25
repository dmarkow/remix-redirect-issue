import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { destroySession, getSession } from "~/sessions.server";

export const loader = async ({ request }: LoaderArgs) => {
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  if (!session.has("token")) {
    // if there is no user session, redirect to login
    throw redirect("/login");
  }
  return json({ status: session.get("token") });
};

export const action = async ({ request }: ActionArgs) => {
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function PrivatePage() {
  const fetcher = useFetcher();
  const { status } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load("/data");
    }
  }, [fetcher]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div>Session Status: {status}</div>
      <div>Loader Data: {JSON.stringify(fetcher.data)}</div>
      <Form method="post">
        <button>Log Out</button>
      </Form>
    </div>
  );
}
