import { apiPost } from "@/lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter — proxies to the WordPress newsletter endpoint (assumed path;
 * update if the real one differs). A simple honeypot field discards obvious bots.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim();
  const honeypot = String(body?.website ?? "");

  if (honeypot) return Response.json({ ok: true }); // silently succeed for bots
  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, message: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await apiPost("/newsletter/subscribe", { email, consent: true });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 502 });
  }
}
