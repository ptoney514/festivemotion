import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#ff5a1f]/10">
            <svg
              className="size-8 text-[#ff5a1f]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>

          <h1 className="mt-6 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
            Check your email
          </h1>
          <p className="mt-3 text-sm text-white/50">
            A sign-in link has been sent to your email address. Click the link
            to complete sign in.
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-white/40 transition hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
