import { NewsCard } from "./NewsCards";
import { RefreshButton } from "./RefreshButton";
import { SectionHeader } from "./SectionHeader";
import { StateMessage } from "./StateMessage";

/** Home page news: one featured article and up to three supporting ones. */
export function LatestNews({ news }) {
  const [featured, ...rest] = news.articles;
  const supporting = rest.slice(0, 3);

  return (
    <section className="page-section" aria-labelledby="news-title">
      <div className="container">
        <SectionHeader
          id="news-title"
          title="Latest automotive news"
          text="Launches, reviews and the stories shaping the Indian car market."
          href="/news"
          linkLabel="All news"
        />

        {!news.ok ? (
          <StateMessage
            title="News is unavailable right now."
            text="Please try again in a moment."
            action={<RefreshButton />}
          />
        ) : !featured ? (
          <StateMessage title="No news yet" text="No articles have been published yet. Please check back soon." />
        ) : (
          <div className={`news-layout${supporting.length === 0 ? " news-layout--single" : ""}`}>
            <NewsCard article={featured} variant="featured" />
            {supporting.length > 0 ? (
              <ul className="news-stack">
                {supporting.map((article) => (
                  <li key={article.slug}>
                    <NewsCard article={article} variant="row" />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
