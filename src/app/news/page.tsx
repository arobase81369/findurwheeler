import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Automotive News",
  robots: { index: false }, // remove when the page has real content
};

export default function Page() {
  return (
    <ComingSoon
      title="Automotive News"
      description="This page is being built. Launches, reviews and market stories will appear here."
    />
  );
}
