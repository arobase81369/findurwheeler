import { apiGet } from "./api.js";
import { formatDateLong, toNumber } from "./format.js";

/**
 * News adapters. The /news response shape has not been confirmed, so this assumes
 * { success, data: [...] } (like the other list endpoints) and accepts common field names.
 * Nothing is invented: missing fields stay empty and the UI simply omits them.
 */

const text = (value) => (value === null || value === undefined ? "" : String(value).trim());

function first(raw, keys) {
  for (const key of keys) {
    const value = raw?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function label(value) {
  if (Array.isArray(value)) return label(value[0]);
  if (value && typeof value === "object") return text(value.name ?? value.title ?? value.label);
  return text(value);
}

function imageUrl(value) {
  if (value && typeof value === "object") return text(value.url ?? value.src ?? value.large ?? value.medium);
  return text(value);
}

function stripTags(html) {
  return String(html)
    .replace(/<\/(p|div|h[1-6]|li|blockquote|section)>|<br\s*\/?>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => {
      try {
        return String.fromCodePoint(Number(code));
      } catch {
        return "";
      }
    });
}

/** Article body -> plain-text paragraphs (any HTML is stripped, so nothing is injected into the page). */
export function toParagraphs(content) {
  return stripTags(text(content))
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** One item from GET /news (or /news/{slug}) -> the shape the UI uses. Returns null if unusable. */
export function toArticle(raw) {
  if (!raw || typeof raw !== "object") return null;

  const title = text(first(raw, ["title", "name", "headline"]));
  const slug = text(first(raw, ["slug"]));
  if (!title || !slug) return null;

  const dateRaw = text(first(raw, ["published_at", "published_date", "publish_date", "date", "created_at"]));
  const parsed = dateRaw ? new Date(dateRaw.length <= 10 ? `${dateRaw}T00:00:00Z` : dateRaw.replace(" ", "T")) : null;

  const readRaw = first(raw, ["read_time", "reading_time", "read_time_minutes", "reading_time_minutes"]);
  const readNumber = toNumber(readRaw);
  const readTime = readNumber
    ? `${readNumber} min read`
    : typeof readRaw === "string" && /[a-z]/i.test(readRaw)
      ? readRaw.trim()
      : "";

  return {
    id: text(raw.id),
    slug,
    title,
    excerpt: stripTags(text(first(raw, ["excerpt", "summary", "short_description", "description"]))).replace(/\s+/g, " ").trim(),
    category: label(first(raw, ["category", "category_name", "categories"])),
    image: imageUrl(first(raw, ["image", "featured_image", "image_url", "thumbnail", "cover_image"])) || null,
    date: dateRaw ? formatDateLong(dateRaw) : "",
    dateIso: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : "",
    readTime,
    content: text(first(raw, ["content", "body", "article_body"])),
  };
}

const newestFirst = (a, b) => (a.dateIso && b.dateIso ? b.dateIso.localeCompare(a.dateIso) : 0);

/** GET /news. Never throws: returns { ok, articles }. */
export async function getNews() {
  try {
    const payload = await apiGet("/news");
    if (payload && payload.success === false) return { ok: false, articles: [] };
    const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : null;
    if (!rows) return { ok: false, articles: [] };
    return { ok: true, articles: rows.map(toArticle).filter(Boolean).sort(newestFirst) };
  } catch {
    return { ok: false, articles: [] };
  }
}

/**
 * One article by slug: tries GET /news/{slug}, then falls back to the list.
 * Returns null when the article does not exist; throws if the news API is unreachable.
 */
export async function getArticle(slug) {
  try {
    const payload = await apiGet(`/news/${encodeURIComponent(slug)}`);
    const article = payload?.success === false ? null : toArticle(payload?.data ?? payload);
    if (article) return article;
  } catch {
    /* fall through to the list */
  }

  const list = await getNews();
  const found = list.articles.find((article) => article.slug === slug);
  if (found) return found;
  if (!list.ok) throw new Error("News is unavailable");
  return null;
}
