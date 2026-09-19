/**
 * Thin, typed wrapper around the FindUrWheeler WordPress REST API.
 *
 * Only call this from server code (Server Components, route handlers) so the
 * browser never talks to WordPress directly and there are no CORS concerns.
 *
 * Car/variant types are intentionally NOT defined yet: they must be derived
 * from the real API response (run `npm run inspect:api`), never guessed.
 */

const API_BASE =
  process.env.FWY_API_BASE_URL ??
  "https://yellow-kudu-942759.hostingersite.com/wp-json/fwy/v1";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiGetOptions = {
  /** Seconds to cache the response on the server. Default: 5 minutes. */
  revalidate?: number;
};

export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: options.revalidate ?? 300 },
  });

  if (!response.ok) {
    // Keep the message generic: never surface raw upstream errors to users.
    throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
