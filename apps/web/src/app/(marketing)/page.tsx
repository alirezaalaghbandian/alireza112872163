import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-app">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-semibold text-sm">
            O
          </div>
          <span className="text-lg font-semibold text-text-primary">OpsCore</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center rounded-md bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-text-primary sm:text-[42px] sm:leading-[1.15]">
          Enterprise Operations Intelligence, Unified
        </h1>
        <p className="mt-4 max-w-lg text-lg text-text-secondary">
          Monitor KPIs, detect anomalies, and resolve incidents with AI-assisted
          root-cause analysis — all in one platform.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-md bg-brand-500 px-5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors"
          >
            Start free trial
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-md border border-border-strong px-5 text-sm font-medium text-text-primary hover:bg-bg-sunken transition-colors"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
