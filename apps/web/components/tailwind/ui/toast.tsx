"use client";

import { useEffect } from "react";

export default function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 rounded-lg bg-black px-4 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}