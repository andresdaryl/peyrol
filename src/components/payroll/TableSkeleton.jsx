const TableSkeleton = () => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Employee</th>
              <th className="px-4 py-3 text-left text-sm">Base Pay</th>
              <th className="px-4 py-3 text-left text-sm">OT Pay</th>
              <th className="px-4 py-3 text-left text-sm">Gross</th>
              <th className="px-4 py-3 text-left text-sm">Net</th>
              <th className="px-4 py-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-4 py-3">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-32"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-20"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-20"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-24"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-24"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded-lg"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableSkeleton
