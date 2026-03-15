"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#090909", fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#ff5a1f", fontSize: 28, fontWeight: 700 }}>
            FestiveMotion
          </h1>
          <h2 style={{ color: "#fff", fontSize: 24, marginTop: 24 }}>
            Something went wrong
          </h2>
          <p style={{ color: "#aaa", fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>
            An unexpected error occurred. Please try again or return to the
            homepage.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                background: "#ff5a1f",
                color: "#fff",
                border: "none",
                borderRadius: 9999,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 9999,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Go home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
