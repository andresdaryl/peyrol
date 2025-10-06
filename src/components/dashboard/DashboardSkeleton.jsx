const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-64 mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
        ))}
      </div>

      {/* Info Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
              </div>
              <div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
            <div className="h-[300px] bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardSkeleton
