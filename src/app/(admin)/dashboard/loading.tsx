export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-border/60 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="h-80 bg-surface rounded-lg animate-pulse" />
        </div>
        <div className="lg:col-span-8 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-surface rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
