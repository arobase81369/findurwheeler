import Link from "next/link";

/**
 * News images can live on any host, so a plain <img> is used (next/image would need every
 * host listed in next.config). Size is reserved with CSS aspect ratios to avoid layout shift.
 */
function NewsImage({ article }) {
  if (!article.image) return <span className="news-img news-img--empty" aria-hidden="true" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={article.image} alt="" loading="lazy" decoding="async" className="news-img" />
  );
}

export function NewsMeta({ article }) {
  if (!article.date && !article.readTime) return null;
  return (
    <p className="news-meta">
      {article.date ? article.dateIso ? <time dateTime={article.dateIso}>{article.date}</time> : article.date : null}
      {article.date && article.readTime ? " · " : null}
      {article.readTime}
    </p>
  );
}

/**
 * variant "featured": large image on top (home).  "row": image beside text (home).
 * "card": standard vertical card (news page).
 * @param {{ article: NonNullable<ReturnType<typeof import("@/lib/news.js").toArticle>>, variant?: "featured" | "row" | "card", as?: "h2" | "h3" }} props
 */
export function NewsCard({ article, variant = "card", as: Heading = "h3" }) {
  return (
    <article className={`news-card news-card--${variant}`}>
      <div className="news-card__media">
        <NewsImage article={article} />
      </div>
      <div className="news-card__body">
        {article.category ? <span className="news-tag">{article.category}</span> : null}
        <Heading className="news-card__title">
          <Link href={`/news/${article.slug}`} className="news-link">
            {article.title}
          </Link>
        </Heading>
        {article.excerpt ? <p className="news-excerpt">{article.excerpt}</p> : null}
        <NewsMeta article={article} />
      </div>
    </article>
  );
}
