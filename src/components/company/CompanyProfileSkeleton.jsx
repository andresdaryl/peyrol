"use client"

const CompanyProfileSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700 p-6 flex items-center space-x-4">
        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="space-y-2">
          <div className="w-48 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-72 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Section Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700 p-6 space-y-4">
            <div className="w-40 h-5 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
            <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="w-2/3 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>

        {/* Form Section Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700 p-6">
            <div className="w-48 h-5 bg-slate-200 dark:bg-slate-700 rounded mb-6" />

            <div className="space-y-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-40 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-32 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Policies Section Skeleton */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700 p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-48 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="w-full h-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        <div className="w-full h-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        <div className="mt-4 flex justify-end">
          <div className="w-32 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default CompanyProfileSkeleton
