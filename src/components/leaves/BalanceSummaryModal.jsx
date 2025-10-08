"use client"

const BalanceSummaryModal = ({ show, balanceSummary, formLoading, onClose }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Leave Balance Summary</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">All employees ({balanceSummary.length})</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {formLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-100 dark:bg-slate-700 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Sick Leave
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Vacation Leave
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {balanceSummary.map((balance, index) => (
                    <tr key={index} className="hover:bg-amber-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm text-slate-800 dark:text-white font-medium">
                        {balance.employee_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {balance.department || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="space-y-1">
                          <div>
                            Balance:{" "}
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {balance.sick_leave?.balance || 0}
                            </span>
                          </div>
                          <div className="text-xs">
                            Used: {balance.sick_leave?.used || 0} / Total: {balance.sick_leave?.total || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="space-y-1">
                          <div>
                            Balance:{" "}
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {balance.vacation_leave?.balance || 0}
                            </span>
                          </div>
                          <div className="text-xs">
                            Used: {balance.vacation_leave?.used || 0} / Total: {balance.vacation_leave?.total || 0}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default BalanceSummaryModal
