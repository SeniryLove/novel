import BlogMenuBar from "@/components/tailwind/blog/BlogMenuBar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP MENU */}
      <BlogMenuBar />

      {/* PAGE CONTENT */}
      <div className="flex-1">{children}</div>
    </div>
  );
}