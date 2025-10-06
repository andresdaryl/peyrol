import { Calendar } from "lucide-react"

const HolidayCalendarCard = ({ data }) => {
  if (!data) return null

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Upcoming Holidays</h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Holidays {data.year}</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.total_holidays}</p>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {data.upcoming_holidays.map((holiday) => (
            <div
              key={holiday.id}
              className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{holiday.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(holiday.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full whitespace-nowrap">
                  {holiday.days_until} days
                </span>
              </div>
              <span
                className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                  holiday.type === "regular_holiday"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
                }`}
              >
                {holiday.type.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HolidayCalendarCard
