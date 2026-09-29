"use client";

import { useId, useState } from "react";

const IDLE = { status: "idle", message: "" };

export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState(IDLE);
  const loading = state.status === "loading";

  async function onSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setState({ status: "loading", message: "" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: honeypot }),
      });
      const json = await response.json().catch(() => ({}));

      if (response.ok && json.ok) {
        setEmail("");
        setState({ status: "success", message: "Thanks for subscribing. Please check your inbox." });
      } else {
        setState({ status: "error", message: json.message || "Something went wrong. Please try again." });
      }
    } catch {
      setState({ status: "error", message: "Something went wrong. Please try again." });
    }
  }

  return (
    <form className="newsletter__form" onSubmit={onSubmit} noValidate>
      <label htmlFor={`${id}-email`} className="visually-hidden">
        Your email address
      </label>
      <input
        id={`${id}-email`}
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="Your email address"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (state.status !== "idle") setState(IDLE);
        }}
        className="newsletter__input"
        aria-describedby={`${id}-status`}
      />
      {/* Honeypot: hidden from people, filled in by simple bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="newsletter__trap"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
      />
      <button type="submit" className="btn btn--primary newsletter__button" disabled={loading}>
        {loading ? "Subscribing…" : "Subscribe"}
      </button>
      <p
        id={`${id}-status`}
        role="status"
        className={`newsletter__status${state.status === "error" ? " is-error" : ""}${state.status === "success" ? " is-success" : ""}`}
      >
        {state.message}
      </p>
    </form>
  );
}
