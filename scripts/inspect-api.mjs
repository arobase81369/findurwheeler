#!/usr/bin/env node
/**
 * Fetches the FindUrWheeler cars API and prints its real shape, so the
 * TypeScript types can be written from facts instead of guesses.
 *
 *   npm run inspect:api
 *
 * Full responses are saved to ./api-samples/ (git-ignored). Paste the
 * printed output (or those files) back into the chat.
 */
import { mkdir, writeFile } from "node:fs/promises";

const BASE = (process.env.FWY_API_BASE_URL ??
  "https://arobasedesigns.in/wp-json/fwy/v1").replace(/\/$/, "");

async function get(path) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* not JSON */
    }
    return { url, status: res.status, contentType: res.headers.get("content-type"), text, json };
  } catch (error) {
    return { url, status: 0, contentType: null, text: String(error), json: null };
  }
}

function describe(value, label = "root") {
  if (Array.isArray(value)) {
    const first = value[0];
    const keys = first && typeof first === "object" ? Object.keys(first).join(", ") : typeof first;
    return `${label}: array, ${value.length} item(s); first item keys: ${keys}`;
  }
  if (value && typeof value === "object") {
    const lines = [`${label}: object, keys: ${Object.keys(value).join(", ")}`];
    for (const [key, child] of Object.entries(value)) {
      if (Array.isArray(child)) lines.push(describe(child, `  ${key}`));
    }
    return lines.join("\n");
  }
  return `${label}: ${typeof value}`;
}

function findFirstId(json) {
  const list = Array.isArray(json)
    ? json
    : json && typeof json === "object"
      ? Object.values(json).find((v) => Array.isArray(v))
      : null;
  return list?.[0]?.id ?? null;
}

await mkdir("api-samples", { recursive: true });

const list = await get("/cars");
console.log(`\n=== GET ${list.url}\nstatus: ${list.status}  content-type: ${list.contentType}`);
if (list.json === null) {
  console.log("Response is not JSON. First 500 chars:\n" + list.text.slice(0, 500));
} else {
  await writeFile("api-samples/cars-list.json", JSON.stringify(list.json, null, 2));
  console.log(describe(list.json));
  const sample = Array.isArray(list.json)
    ? list.json.slice(0, 2)
    : Object.fromEntries(
        Object.entries(list.json).map(([k, v]) => [k, Array.isArray(v) ? v.slice(0, 2) : v]),
      );
  console.log("\nSample (first 2 items):\n" + JSON.stringify(sample, null, 2));
}

const id = (list.json && findFirstId(list.json)) ?? 1;
const one = await get(`/cars/${id}`);
console.log(`\n=== GET ${one.url}\nstatus: ${one.status}  content-type: ${one.contentType}`);
if (one.json === null) {
  console.log("Response is not JSON. First 500 chars:\n" + one.text.slice(0, 500));
} else {
  await writeFile("api-samples/car-detail.json", JSON.stringify(one.json, null, 2));
  console.log(JSON.stringify(one.json, null, 2));
}

console.log("\nSaved full responses to ./api-samples/");
