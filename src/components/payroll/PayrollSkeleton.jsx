const PayrollSkeleton = (loading) => {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-4xl font-bold text-slate-800 dark:text-white"
            data-testid="payroll-title"
          >
            Payroll
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create and manage payroll runs
          </p>
        </div>
        <div className="h-10 w-48 bg-gradient-to-r from-amber-300 to-orange-400 opacity-60 rounded-xl"></div>
      </div>

      {/* Payroll layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        {/* Runs list skeleton */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="h-5 w-1/3 bg-slate-300/40 dark:bg-slate-700/40 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-slate-300/30 dark:bg-slate-700/30 rounded-lg"
            ></div>
          ))}
        </div>

        {/* Right side (details + summary) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary card */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/2 bg-slate-300/40 dark:bg-slate-700/40 rounded"></div>
                <div className="h-6 w-3/4 bg-slate-300/30 dark:bg-slate-700/30 rounded"></div>
              </div>
            ))}
          </div>

          {/* Actions row */}
          <div className="flex flex-wrap gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-32 bg-slate-300/30 dark:bg-slate-700/30 rounded-xl"
              ></div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="h-5 w-1/4 bg-slate-300/40 dark:bg-slate-700/40 rounded mb-4"></div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-slate-300/20 dark:bg-slate-700/20 rounded mb-3"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollSkeleton;
