"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* dismissed or unavailable: nothing to do */
    }
  }

  return (
    <button type="button" className="btn btn--secondary btn--sm" onClick={share}>
      <Icon name="share" size={16} />
      <span>{copied ? "Link copied" : "Share"}</span>
      <span className="visually-hidden" role="status">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </button>
  );
}
