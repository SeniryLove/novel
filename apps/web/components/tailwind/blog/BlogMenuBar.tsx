"use client";

import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function BlogMenuBar() {
  const router = useRouter();
  const { isLogin, loading, setIsLogin } = useAuth();

  async function logout() {
    await apiFetch("/api/Auth/logout", {
      method: "POST",
    });

    window.location.reload();
  }

  return (
    <div className="w-full border-b px-4 py-3 flex items-center gap-4">
      <Link href="/blog" className="font-bold">
        Blog
      </Link>

      <Link href="/docs">Docs</Link>

      <div className="ml-auto flex gap-3">
        {loading ? (
          <span>...</span>
        ) : isLogin ? (
          <button onClick={logout} className="text-red-500">
            Logout
          </button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </div>
  );
}