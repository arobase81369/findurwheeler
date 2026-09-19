import Link from "next/link";

type ComingSoonProps = {
  title: string;
  description: string;
};

/** Honest placeholder for routes that exist but are not built yet. */
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section className="container page-section">
      <div className="empty-state">
        <h1 className="empty-state__title">{title}</h1>
        <p className="empty-state__text">{description}</p>
        <Link href="/" className="btn btn--secondary">
          Back to home
        </Link>
      </div>
    </section>
  );
}
