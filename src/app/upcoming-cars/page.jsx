import { ComingSoon } from "@/components/ComingSoon";

export const metadata = {
  title: "Upcoming Cars in India",
  robots: { index: false }, // remove when the page has real content
};

export default function Page() {
  return (
    <ComingSoon
      title="Upcoming Cars in India"
      description="This page is being built. Launch dates and prices will appear only when they are supported by data."
    />
  );
}
