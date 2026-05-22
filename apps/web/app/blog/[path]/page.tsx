import BlogEditor from "./BlogEditor";
import { apiFetch } from "@/lib/api";

type Props = {
  params: Promise<{ path: string }>;
};

type Blog = {
  id: number;
  path: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

async function getBlog(path: string): Promise<Blog | null> {
  // console.log(path);
  const res = await apiFetch(
    `/api/Blog/${path}`,
    {
      cache: "no-store",
    }
  );
  
  if (!res.ok) return null;
  const data = await res.json();
  // console.log(data);
  return data;
}

export default async function Page({ params }: Props) {
  const { path } = await params;
  const blog = await getBlog(path);

  if (!blog) {
    return (
      <div className="p-10 text-red-500">
        404 Blog Not Found
      </div>
    );
  }

  // content safe parse
  let content = blog.content;

  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch {}
  }

  return (
    <BlogEditor
      path={blog.path}
      initialContent={content}
      createdAt={blog.createdAt}
      updatedAt={blog.updatedAt}
      tags={blog.tags}
    />
  );
}