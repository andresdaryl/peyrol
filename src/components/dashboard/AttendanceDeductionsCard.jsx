import { MinusCircle } from "lucide-react"

const AttendanceDeductionsCard = ({ data, formatCurrency }) => {
  if (!data) return null

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
          <MinusCircle className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Attendance Deductions</h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Deductions</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(data.deductions.total)}</p>
        </div>
        <div className="space-y-3">
          {["late", "absent", "undertime"].map((type) => (
            <div
              key={type}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white capitalize">{type}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{data.deductions[type].count} occurrences</p>
              </div>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {formatCurrency(data.deductions[type].total_amount)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2">
          Period: {new Date(data.period.start_date).toLocaleDateString()} -{" "}
          {new Date(data.period.end_date).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default AttendanceDeductionsCard
