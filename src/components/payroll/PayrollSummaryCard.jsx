const PayrollSummaryCard = ({ summary }) => {
  if (!summary) return null

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Gross Pay</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">₱{summary.total_gross?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Deductions</p>
          <p className="text-2xl font-bold text-red-600">₱{summary.total_deductions?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Net Pay</p>
          <p className="text-2xl font-bold text-green-600">₱{summary.total_net?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export default PayrollSummaryCard
