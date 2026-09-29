import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsCard } from "@/components/NewsCards";
import { RefreshButton } from "@/components/RefreshButton";
import { StateMessage } from "@/components/StateMessage";
import { getNews } from "@/lib/news";

export const revalidate = 300;

export const metadata = {
  title: "Automotive News — Launches, Reviews & Car Market Stories",
  description: "Latest automotive news: launches, reviews and the stories shaping the Indian car market.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const { ok, articles } = await getNews();

  return (
    <section className="container page-section">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "News" }]} />
      <div className="section-header">
        <h1 className="section-header__title">Automotive news</h1>
        <p className="section-header__text">Launches, reviews and the stories shaping the Indian car market.</p>
      </div>

      {!ok ? (
        <StateMessage title="News is unavailable right now." text="Please try again in a moment." action={<RefreshButton />} />
      ) : articles.length === 0 ? (
        <StateMessage title="No news yet" text="No articles have been published yet. Please check back soon." />
      ) : (
        <ul className="news-grid">
          {articles.map((article) => (
            <li key={article.slug}>
              <NewsCard article={article} variant="card" as="h2" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
