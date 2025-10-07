"use client"

const AttendanceFilters = ({ employeeFilter, setEmployeeFilter, employees, setPage }) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <select
            value={employeeFilter}
            onChange={(e) => {
              setEmployeeFilter(e.target.value)
              setPage(1)
            }}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white"
            data-testid="employee-filter"
          >
            <option value="">All Employees</option>
            {employees?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default AttendanceFilters
