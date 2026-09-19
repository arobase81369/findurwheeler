import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Compare Cars",
  robots: { index: false }, // remove when the page has real content
};

export default function Page() {
  return (
    <ComingSoon
      title="Compare Cars"
      description="This page is being built. You will be able to compare cars side by side."
    />
  );
}
