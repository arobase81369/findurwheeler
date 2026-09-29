import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsCard, NewsMeta } from "@/components/NewsCards";
import { getArticle, getNews, toParagraphs } from "@/lib/news";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let article;
  try {
    article = await getArticle(slug);
  } catch {
    return { title: "News" };
  }
  if (!article) return { title: "Article not found", robots: { index: false } };

  const description = article.excerpt || `${article.title} — ${SITE.name} automotive news.`;
  return {
    title: article.title,
    description,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      type: "article",
      siteName: SITE.name,
      locale: "en_IN",
      title: article.title,
      description,
      url: `/news/${article.slug}`,
      images: article.image ? [{ url: article.image, alt: article.title }] : undefined,
      publishedTime: article.dateIso || undefined,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const { articles } = await getNews();
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const paragraphs = toParagraphs(article.content);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.image || undefined,
    datePublished: article.dateIso || undefined,
    publisher: { "@type": "Organization", name: SITE.name },
  };

  return (
    <article className="container page-section news-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd).replace(/</g, "\\u003c") }}
      />

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: article.title }]} />

      <header className="news-article__header">
        {article.category ? <span className="news-tag">{article.category}</span> : null}
        <h1 className="news-article__title">{article.title}</h1>
        <NewsMeta article={article} />
      </header>

      {article.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.image} alt="" className="news-article__image" />
      ) : null}

      {paragraphs.length > 0 ? (
        <div className="news-article__body">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : article.excerpt ? (
        <p className="news-article__body">{article.excerpt}</p>
      ) : null}

      {related.length > 0 ? (
        <section className="detail-section" aria-labelledby="related-title">
          <h2 id="related-title" className="section-header__title">
            More news
          </h2>
          <ul className="news-grid">
            {related.map((item) => (
              <li key={item.slug}>
                <NewsCard article={item} variant="card" />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="section-footer">
          <Link href="/news" className="text-link">
            Back to all news
          </Link>
        </p>
      )}
    </article>
  );
}
