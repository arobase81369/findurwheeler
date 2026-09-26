"use client";

import { useRouter } from "next/navigation";

export function RefreshButton({ children = "Try again" }) {
  const router = useRouter();
  return (
    <button type="button" className="btn btn--secondary" onClick={() => router.refresh()}>
      {children}
    </button>
  );
}
