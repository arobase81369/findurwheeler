import { ComingSoon } from "@/components/ComingSoon";

export const metadata = {
  title: "New Cars in India",
  robots: { index: false }, // remove when the page has real content
};

export default function Page() {
  return (
    <ComingSoon
      title="New Cars in India"
      description="The car listing is being connected to the FindUrWheeler data source."
    />
  );
}
