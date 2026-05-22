"use client";

import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { useState, useEffect } from "react";
import {type JSONContent} from "novel"
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

import UpdateBlogTagsModal from "@/components/tailwind/blog/UpdateBlogTagsModal"

type Props = {
  path: string;
  initialContent: any;
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

export default function BlogEditor({
  path,
  initialContent,
  createdAt,
  updatedAt,
  tags,
}: Props) {

  const [_updatedAt, setUpdatedAt] = useState(
    new Date(updatedAt).toLocaleString("zh-TW")
  );
  const { isLogin, loading } = useAuth();
  const [openTagEditor, setOpenTagEditor] = useState(false);
  const [tagInput, setTagInput] = useState(tags.join(", "));
  const [currentTags, setCurrentTags] = useState(tags);
    
  useEffect(() => {
    setUpdatedAt(
      new Date(updatedAt).toLocaleString("zh-TW")
    );
  }, [updatedAt]);

  useEffect(() => {
    setCurrentTags(tags);
    setTagInput(tags.join(", "));
  }, [tags]);

  async function onSave(path: string, json: JSONContent) {

    const res = await apiFetch(`/api/Blog?path=${path}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: JSON.stringify(json), // JSONContent or string
          }),
        });

    const data = await res.json();

    // ✅ 更新後才setState
    setUpdatedAt(new Date(data.updatedAt).toLocaleString("zh-TW"));
  }

  if (loading) return null;
  
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">

      {/* meta */}
      <div className="w-full max-w-screen-lg px-4">
        <h1 className="text-2xl font-bold">{path}</h1>

        <div className="text-sm text-gray-500">
          <span>Created At: {new Date(createdAt).toLocaleString("zh-TW")}</span>
        </div>
        <div className="text-sm text-gray-500" id="updatedAt">
          <span>Updated At: {_updatedAt}</span>
        </div>

        <div className="mt-2 flex gap-2 items-center">
          {currentTags?.map((t) => (
            <span
              key={t}
              className="bg-gray-200 px-2 py-1 text-xs rounded"
            >
              #{t}
            </span>
          ))}

          {isLogin && (
            <button
              onClick={() => setOpenTagEditor(true)}
              className="text-xs text-blue-500 hover:underline"
            >
              修改標籤
            </button>
          )}
        </div>
      </div>

      {/* editor */}
      <TailwindAdvancedEditor
        page={path}
        _initialContent={initialContent}
        onSave={onSave}
        editable={isLogin}
      />

      {openTagEditor && (
        <UpdateBlogTagsModal
          open={openTagEditor}
          path={path}
          tags={currentTags}
          onClose={() => setOpenTagEditor(false)}
          onSuccess={(newTags) => {
            setCurrentTags(newTags);
          }}
        />
      )}
    </div>

    
  );
}