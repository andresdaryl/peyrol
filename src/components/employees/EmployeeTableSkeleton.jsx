const EmployeeTableSkeleton = () => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Salary Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Rate</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                    ))}
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

export default EmployeeTableSkeleton
