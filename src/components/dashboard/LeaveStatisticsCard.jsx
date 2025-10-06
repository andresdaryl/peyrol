import { FileText, AlertCircle } from "lucide-react"

const LeaveStatisticsCard = ({ data }) => {
  if (!data) return null

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Leave Statistics</h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-center space-x-2 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Requests</p>
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{data.pending_requests}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-green-600 dark:text-green-400 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.approved_this_month}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">this month</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{data.total_rejected}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">all time</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">This Month Breakdown</p>
          <div className="space-y-2">
            {Object.entries(data.this_month_breakdown).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{key.replace("_", " ")}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaveStatisticsCard
