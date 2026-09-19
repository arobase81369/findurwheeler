/**
 * Thin wrapper around the FindUrWheeler WordPress REST API.
 *
 * Only call this from server code (Server Components, route handlers) so the
 * browser never talks to WordPress directly and there are no CORS concerns.
 *
 * Car/variant shapes are intentionally NOT assumed yet: document them (JSDoc
 * typedefs) from the real API response (run `npm run inspect:api`).
 */

const API_BASE =
  process.env.FWY_API_BASE_URL ??
  "https://yellow-kudu-942759.hostingersite.com/wp-json/fwy/v1";

export class ApiError extends Error {
  /** @param {number} status @param {string} message */
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * @param {string} path e.g. "/cars" or "/cars/1"
 * @param {{ revalidate?: number }} [options] revalidate = seconds to cache (default 300)
 * @returns {Promise<any>}
 */
export async function apiGet(path, options = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: options.revalidate ?? 300 },
  });

  if (!response.ok) {
    // Keep the message generic: never surface raw upstream errors to users.
    throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`);
  }

  return response.json();
}
