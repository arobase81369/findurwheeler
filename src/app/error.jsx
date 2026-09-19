"use client";

export default function ErrorPage({ reset }) {
  return (
    <section className="container page-section">
      <div className="empty-state">
        <h1 className="empty-state__title">Something went wrong</h1>
        <p className="empty-state__text">We couldn&apos;t load this page. Please try again.</p>
        <button type="button" className="btn btn--primary" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </section>
  );
}
