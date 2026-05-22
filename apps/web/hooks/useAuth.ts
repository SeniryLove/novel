"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await apiFetch("/api/Auth/me");

        if (res.ok) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      } catch {
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, []);

  return { isLogin, loading, setIsLogin };
}