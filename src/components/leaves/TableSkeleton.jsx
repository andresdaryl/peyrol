const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-amber-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-amber-100 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Employee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Leave Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Start Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">End Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Days</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  </div>
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
