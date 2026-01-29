import { redis } from "@/lib/redis";
import { notFound } from "next/navigation";

export default async function PastePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params; // ✅ FIX

  const paste = await redis.hgetall<any>(`paste:${id}`);

  if (!paste) {
    notFound();
  }

  const now = Date.now();

  // TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    notFound();
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    notFound();
  }

  // Increment view count
  const views = await redis.hincrby(`paste:${id}`, "views", 1);

  if (paste.max_views !== null && views > paste.max_views) {
    notFound();
  }

  return <pre style={{ whiteSpace: "pre-wrap" }}>{paste.content}</pre>;
}
