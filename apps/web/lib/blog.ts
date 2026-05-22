import { apiFetch } from "@/lib/api";

export async function fetchBlogs(query: string) {
  const res = await apiFetch(
    `/api/Blog?${query}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}