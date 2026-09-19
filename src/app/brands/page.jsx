import { ComingSoon } from "@/components/ComingSoon";

export const metadata = {
  title: "Car Brands",
  robots: { index: false }, // remove when the page has real content
};

export default function Page() {
  return (
    <ComingSoon
      title="Car Brands"
      description="This page is being built. Brand pages will list every model available in India."
    />
  );
}
