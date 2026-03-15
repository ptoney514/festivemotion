import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/schema";

function initAuth() {
  const db = getDb();
  if (!db) throw new Error("Database connection not available — check DATABASE_URL");

  return NextAuth({
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }),
    providers: [
      Resend({
        from: process.env.EMAIL_FROM ?? "auth@smallhr.app",
        apiKey: process.env.AUTH_RESEND_KEY,
      }),
    ],
    pages: {
      signIn: "/auth/signin",
      verifyRequest: "/auth/verify-request",
    },
    session: { strategy: "database" },
  });
}

let _cached: ReturnType<typeof initAuth> | undefined;
function lazy() {
  if (!_cached) _cached = initAuth();
  return _cached;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers = new Proxy({} as any, {
  get(_target, prop) {
    return lazy().handlers[prop as keyof typeof lazy extends never ? never : "GET" | "POST"];
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = ((...args: any[]) => (lazy().auth as any)(...args)) as ReturnType<
  typeof initAuth
>["auth"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signIn = ((...args: any[]) => (lazy().signIn as any)(...args)) as ReturnType<
  typeof initAuth
>["signIn"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signOut = ((...args: any[]) => (lazy().signOut as any)(...args)) as ReturnType<
  typeof initAuth
>["signOut"];
