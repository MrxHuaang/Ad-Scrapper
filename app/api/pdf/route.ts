import { NextResponse } from "next/server";

function isSafeHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url || !isSafeHttpUrl(url)) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const upstream = await fetch(url, {
    // Some providers block requests without a UA.
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
      accept: "application/pdf,*/*;q=0.9",
    },
    // Avoid caching surprises while iterating; can be changed later.
    cache: "no-store",
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Upstream fetch failed (${upstream.status})` },
      { status: 502 },
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "application/pdf";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "content-type": contentType,
      "content-disposition": "inline",
      // Allow embedding inside our own app.
      "x-frame-options": "SAMEORIGIN",
      // Reasonable safety defaults.
      "referrer-policy": "no-referrer",
    },
  });
}

