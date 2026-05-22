"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBlogs } from "@/lib/blog";
import { toHtml } from "@/lib/html";
import { Calendar, Search } from "lucide-react";

import CreateBlogModal from "@/components/tailwind/blog/CreateBlogModal";
import Toast from "@/components/tailwind/ui/toast";
import { useAuth } from "@/hooks/useAuth";

type Blog = {
  id: number;
  path: string;
  content: string;
  createdAt: string;
  tags: string[];
};

export default function BlogPageClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [tagsInput, setTagsInput] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { isLogin } = useAuth();

  const [openCreate, setOpenCreate] = useState(false);
  const [toast, setToast] = useState("");

  const totalPages = Math.ceil(total / pageSize);

  async function loadBlogs(currentPage: number) {
    const query = new URLSearchParams();

    query.append("page", String(currentPage));
    query.append("pageSize", String(pageSize));

    if (tagsInput) query.append("tags", tagsInput);
    if (from) {
      const start = new Date(from);
      start.setHours(0, 0, 0, 0);
      query.append("from", start.toISOString());
    }
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      query.append("to", end.toISOString());
    }

    const data = await fetchBlogs(query.toString());

    setBlogs(data.data);
    setTotal(data.total);
  }

  useEffect(() => {
    loadBlogs(page);
  }, [page]);

  function applyFilter() {
    setPage(1);
    loadBlogs(1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10">

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {"SeniryLove's Blog"}
          </h1>

          {isLogin && (
            <button
              onClick={() => setOpenCreate(true)}
              className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 transition"
            >
              + New Post
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">

        {/* Title row */}
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Search className="h-4 w-4" />
            Filter Posts
        </div>

        {/* inputs row */}
        <div className="flex flex-wrap gap-2">

            {/* tags */}
            <input
            className="flex-1 min-w-[160px] rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            placeholder="tags (dotnet, web)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            />

            {/* date group */}
            <div className="flex items-center gap-2 rounded-md border px-2 py-1 bg-gray-50">

            <Calendar className="h-4 w-4 text-gray-500" />

            <input
                type="date"
                className="bg-transparent text-sm outline-none"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
            />

            <span className="text-xs text-gray-400">→</span>

            <input
                type="date"
                className="bg-transparent text-sm outline-none"
                value={to}
                onChange={(e) => setTo(e.target.value)}
            />
            </div>

            {/* button */}
            <button
            onClick={applyFilter}
            className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
            <Search className="h-4 w-4" />
            Filter
            </button>
        </div>

        {/* helper text */}
        <div className="mt-2 text-xs text-gray-400">
            Filter by tags and created date range
        </div>
        </div>

        {/* Blog List */}
        <div className="mt-6 space-y-4">
          {blogs.map((b) => {
            const html = toHtml(JSON.parse(b.content));

            return (
              <div
                key={b.id}
                className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {/* title */}
                <Link
                  href={`/blog/${b.path}`}
                  className="text-lg font-semibold text-gray-900 hover:underline"
                >
                  {b.path}
                </Link>

                {/* meta */}
                <div className="mt-1 text-xs text-gray-500">
                  {new Date(b.createdAt).toLocaleString()}
                </div>

                {/* tags */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {b.tags?.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* preview */}
                <div
                  className="prose prose-sm mt-3 max-h-[6.5rem] overflow-hidden text-gray-700"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-40"
            disabled={page === 1}
          >
            Prev
          </button>

          <div className="text-sm text-gray-600">
            Page <span className="font-medium">{page}</span> /{" "}
            {totalPages || 1}
          </div>

          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages))
            }
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-40"
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>

        <CreateBlogModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onExists={() => setToast("已存在該路徑")}
          onSuccess={(path: string) => {
            setToast("建立成功");
          }}
        />

        {toast && (
          <Toast message={toast} onClose={() => setToast("")} />
        )}

      </div>
    </div>
  );
}