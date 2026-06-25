import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-4">Page not found</h2>
        <p className="text-sm text-muted mb-8">The page does not exist or has been moved.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold px-4 py-2.5 text-sm bg-white text-foreground border border-border hover:bg-surface">Go Home</Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold px-4 py-2.5 text-sm bg-foreground text-white hover:bg-foreground/90">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
