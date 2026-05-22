"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const res = await apiFetch("/api/Auth/login", {
      method: "POST",
      headers: {
      "Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Login failed");
      return;
    }
    
    router.push("/blog");
    router.refresh();
  }

  return (
    <div className="p-10 max-w-sm">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-black text-white px-4 py-2"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}