import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import type { Page } from "@playwright/test";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

const TEST_USER = {
  id: "e2e-test-user-001",
  name: "Test User",
  email: "pernellg@proton.me",
};

const TEST_SESSION_TOKEN = "e2e-test-session-token-001";

export async function seedTestSession() {
  // Upsert user
  await sql`
    INSERT INTO users (id, name, email, email_verified)
    VALUES (${TEST_USER.id}, ${TEST_USER.name}, ${TEST_USER.email}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      email_verified = EXCLUDED.email_verified
  `;

  // Upsert session (expires 1 hour from now)
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await sql`
    INSERT INTO sessions (session_token, user_id, expires)
    VALUES (${TEST_SESSION_TOKEN}, ${TEST_USER.id}, ${expires})
    ON CONFLICT (session_token) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      expires = EXCLUDED.expires
  `;

  return { token: TEST_SESSION_TOKEN, user: TEST_USER };
}

export async function injectSession(page: Page, token: string) {
  await page.context().addCookies([
    {
      name: "authjs.session-token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}

export async function cleanupTestSession() {
  await sql`DELETE FROM sessions WHERE session_token = ${TEST_SESSION_TOKEN}`;
  await sql`DELETE FROM users WHERE id = ${TEST_USER.id}`;
}
