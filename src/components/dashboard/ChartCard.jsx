const ChartCard = ({
  title,
  icon: Icon,
  gradient,
  children,
  actions,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          </div>
          <div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
        <div className="space-y-3">
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="flex justify-center gap-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
