"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  async function createPaste() {
    setError("");
    setResultUrl("");

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    const payload: any = { content };

    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setResultUrl(data.url);
  }

  return (
    <main style={{ padding: 20, maxWidth: 600 }}>
      <h1>Pastebin Lite</h1>

      <textarea
        placeholder="Enter your text here"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="TTL (seconds, optional)"
        value={ttl}
        onChange={(e) => setTtl(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Max views (optional)"
        value={maxViews}
        onChange={(e) => setMaxViews(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={createPaste}>Create Paste</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resultUrl && (
        <p>
          Paste URL:{" "}
          <a href={resultUrl} target="_blank">
            {resultUrl}
          </a>
        </p>
      )}
    </main>
  );
}
