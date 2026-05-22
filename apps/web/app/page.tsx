import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import Menu from "@/components/tailwind/ui/menu";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { BookOpen, GithubIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">
      <div className="flex w-full max-w-screen-lg items-center gap-2 px-4 sm:mb-[calc(5vh)]">
        <Button size="icon" variant="outline">
          <a href="https://github.com/SeniryLove/novel" target="_blank" rel="noreferrer">
            <GithubIcon />
          </a>
        </Button>
        <Link href="/blog" className="ml-auto">
          <Button variant="ghost">Blog</Button>
        </Link>
        <Menu />
      </div>

      <TailwindAdvancedEditor />
    </div>
  );
}
