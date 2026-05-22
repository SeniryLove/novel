"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateBlogModal({ open, onClose }: Props) {
  const router = useRouter();

  const [path, setPath] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function parseTags(input: string): string[] {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function handleCreate() {
    setLoading(true);
    setError("");

    const tagArray = parseTags(tags);

    const res = await apiFetch("/api/Blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path,
        tags: tagArray,
      }),
    });

    if (res.status === 409) {
      setError("已存在該路徑");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError("建立失敗");
      setLoading(false);
      return;
    }

    const data = await res.json();

    setLoading(false);
    onClose();

    // redirect to editor page
    router.push(`/blog/${data.path}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded-xl bg-white p-5 shadow-xl">

        <h2 className="text-lg font-semibold">Create Blog</h2>

        <input
          className="mt-3 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="path (e.g. my-first-post)"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />

        <input
          className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="tags (dotnet, web)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {error && (
          <div className="mt-2 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-1 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="rounded-md bg-black px-3 py-1 text-sm text-white"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}