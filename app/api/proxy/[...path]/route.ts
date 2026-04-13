import { type NextRequest } from "next/server";

const FLASK_URL = process.env.FLASK_API_URL ?? "http://localhost:5000";

async function proxy(
  req: NextRequest,
  ctx: RouteContext<"/api/proxy/[...path]">,
) {
  const { path } = await ctx.params;
  const target = `${FLASK_URL}/api/${path.join("/")}${req.nextUrl.search}`;

  const headers: HeadersInit = {};
  const contentType = req.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;
  const auth = req.headers.get("authorization");
  if (auth) headers["authorization"] = auth;

  const isStream = path.some((seg) => seg.includes("stream"));

  const flaskRes = await fetch(target, {
    method: req.method,
    headers,
    body: req.method !== "GET" ? await req.blob() : undefined,
  });

  if (isStream && flaskRes.body) {
    return new Response(flaskRes.body, {
      status: flaskRes.status,
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        connection: "keep-alive",
        "transfer-encoding": "chunked",
      },
    });
  }

  const resHeaders = new Headers();
  flaskRes.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "transfer-encoding") {
      resHeaders.set(key, value);
    }
  });

  return new Response(flaskRes.body, {
    status: flaskRes.status,
    headers: resHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const DELETE = proxy;
