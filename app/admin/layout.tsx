import { isAdminAuthenticated } from "@/lib/admin";
import Link from "next/link";
import { AdminCodeGate } from "@/components/admin/admin-code-gate";

export const metadata = {
  title: "Admin | FestiveMotion",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white">
        <AdminCodeGate />
      </div>
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
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}

function AdminLogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.delete("fm_admin");
        const { redirect } = await import("next/navigation");
        redirect("/admin/promo-codes");
      }}
    >
      <button
        type="submit"
        className="text-sm text-white/40 transition hover:text-white"
      >
        Sign out
      </button>
    </form>
  );
}
