const AttendanceTableSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Time In</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Time Out</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Shift</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">OT Hours</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Late Deduction</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Total Deductions</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
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
  )
}

export default AttendanceTableSkeleton
