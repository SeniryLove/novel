"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Props = {
  open: boolean;
  path: string;
  tags: string[];
  onClose: () => void;
  onSuccess?: (tags: string[]) => void;
};

export default function UpdateBlogTagsModal({
  open,
  path,
  tags,
  onClose,
  onSuccess,
}: Props) {
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (open) {
      setTagInput(tags.join(", "));
    }
  }, [open, tags]);

  if (!open) return null;

  async function handleUpdate() {
    const newTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await apiFetch(`/api/Blog?path=${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: newTags,
      }),
    });

    if (!res.ok) return;

    onSuccess?.(newTags);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded-lg bg-white p-5 shadow-xl">

        <h2 className="mb-3 text-lg font-semibold">
          修改標籤
        </h2>

        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="tech, live"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-1 text-sm"
          >
            取消
          </button>

          <button
            onClick={handleUpdate}
            className="rounded-md bg-black px-3 py-1 text-sm text-white"
          >
            修改
          </button>
        </div>
      </div>
    </div>
  );
}