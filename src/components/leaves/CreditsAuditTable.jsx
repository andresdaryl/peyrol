"use client"

const CreditsAuditTable = ({ auditData, onClose }) => {
  if (!auditData) return null

  const { employee_id, adjusted_by, reason, changes } = auditData

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Leave Credit Audit</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p><strong>Employee ID:</strong> {employee_id}</p>
            <p><strong>Adjusted By:</strong> {adjusted_by}</p>
            <p><strong>Reason:</strong> {reason}</p>
          </div>

          <table className="w-full border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden text-sm">
            <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="p-3 text-left">Leave Type</th>
                <th className="p-3 text-right">Old</th>
                <th className="p-3 text-right">Adjustment</th>
                <th className="p-3 text-right">New</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(changes).map(([type, values]) => (
                <tr key={type} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="p-3 capitalize text-slate-800 dark:text-slate-200">
                    {type.replace("_", " ")}
                  </td>
                  <td className="p-3 text-right text-slate-600 dark:text-slate-300">{values.old}</td>
                  <td
                    className={`p-3 text-right font-medium ${
                      values.adjustment > 0
                        ? "text-green-600 dark:text-green-400"
                        : values.adjustment < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {values.adjustment > 0 ? `+${values.adjustment}` : values.adjustment}
                  </td>
                  <td className="p-3 text-right text-slate-800 dark:text-slate-100 font-semibold">{values.new}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CreditsAuditTable
