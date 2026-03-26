import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import Link from "next/link";

export const metadata = {
  title: "Admin | FestiveMotion",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  if (!isAdminEmail(session.user.email)) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-[#0f0f0f] text-white">
          <div className="flex min-h-screen items-center justify-center">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-12 text-center">
              <h1 className="mb-4 text-4xl font-bold text-[#ff5a1f]">403</h1>
              <p className="mb-6 text-lg text-white/60">
                You do not have permission to access this area.
              </p>
              <Link
                href="/"
                className="inline-block rounded-2xl bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
              >
                Go Home
              </Link>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/promo-codes"
              className="text-lg font-bold tracking-tight text-[#ff5a1f]"
            >
              FM Admin
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin/promo-codes"
                className="text-sm text-white/60 transition hover:text-white"
              >
                Promo Codes
              </Link>
            </nav>
          </div>
          <div className="text-sm text-white/40">{session.user.email}</div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
