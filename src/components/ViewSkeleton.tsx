export function ViewSkeleton() {
  return (
    <div
      data-testid="view-skeleton"
      className="mx-auto max-w-5xl animate-pulse space-y-4 p-4 sm:p-6"
      aria-busy="true"
      aria-label="Carregando conteúdo"
    >
      <div className="h-28 rounded-3xl bg-slate-200/70 dark:bg-slate-800/70" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-36 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-36 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="h-52 rounded-3xl bg-slate-200/50 dark:bg-slate-800/50" />
    </div>
  );
}
