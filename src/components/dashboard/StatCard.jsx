import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  change,
  subtext,
  icon: Icon,
  gradient,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="w-12 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-1">
          {change >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`text-sm font-semibold ${
              change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {Number.isFinite(change) ? (
              <>
                {change >= 0 ? "+" : ""}
                {change.toFixed(1)}%
              </>
            ) : (
              "0%"
            )}
          </span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{subtext}</p>
    </div>
  );
};

export default StatCard;
