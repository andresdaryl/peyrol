const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Leave Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Start Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">End Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Days</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
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
