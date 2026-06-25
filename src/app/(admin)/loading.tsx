export default function AdminLoading() {
  return (
    <div className="flex-1 w-full h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-[3px] border-border border-t-accent animate-spin" />
        <p className="text-sm font-semibold text-muted animate-pulse">Loading Studio...</p>
      </div>
    </div>
  );
}
