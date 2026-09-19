import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <ComingSoon
      title="We couldn't find that page"
      description="The page may have moved, or the address may be mistyped. Try the home page instead."
    />
  );
}
