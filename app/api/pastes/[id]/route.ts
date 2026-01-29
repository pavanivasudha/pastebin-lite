import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nowMs } from "@/lib/time";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const key = `paste:${id}`;
  const paste = await redis.hgetall<any>(key);

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = nowMs(req);

  if (paste.expires_at && now >= paste.expires_at) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  const views = await redis.hincrby(key, "views", 1);

  if (paste.max_views !== null && views > paste.max_views) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views !== null ? Math.max(paste.max_views - views, 0) : null,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
