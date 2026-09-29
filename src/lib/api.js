/**
 * Thin wrapper around the FindUrWheeler WordPress REST API.
 * Server-only: call from Server Components and route handlers so the browser never
 * talks to WordPress directly (no CORS concerns).
 */

const API_BASE =
  process.env.FWY_API_BASE_URL ?? "https://arobasedesigns.in/wp-json/fwy/v1";

export class ApiError extends Error {
  /** @param {number} status @param {string} message */
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** { a: 1, b: "" } -> "?a=1". Skips null, undefined and empty values. */
export function buildQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/**
 * @param {string} path e.g. "/cars" or "/cars?fuel=Petrol"
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
    // Generic message: never surface raw upstream errors to users.
    throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * POST JSON to the API. Throws ApiError for non-2xx responses or `{ success: false }` bodies.
 * @param {string} path
 * @param {unknown} body
 */
export async function apiPost(path, body) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`);
  }

  const payload = await response.json().catch(() => ({}));
  if (payload && payload.success === false) {
    throw new ApiError(400, `Request to ${path} was rejected`);
  }
  return payload;
}
