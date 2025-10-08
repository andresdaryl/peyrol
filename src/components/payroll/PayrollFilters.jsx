"use client"
import { Filter, X } from "lucide-react"

const PayrollFilters = ({ filters, onFilterChange, onClearFilters, employees = [] }) => {
  const hasActiveFilters = Object.values(filters).some((value) => value !== "" && value !== null)

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range Filters */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
          <input
            type="date"
            value={filters.start_date || ""}
            onChange={(e) => onFilterChange("start_date", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
          <input
            type="date"
            value={filters.end_date || ""}
            onChange={(e) => onFilterChange("end_date", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
          <select
            value={filters.type || ""}
            onChange={(e) => onFilterChange("type", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm"
          >
            <option value="">All Types</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Employee Filter (for entries) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employee</label>
          <select
            value={filters.employee_id || ""}
            onChange={(e) => onFilterChange("employee_id", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm"
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Version Filter (for entries) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Version</label>
          <input
            type="number"
            min="1"
            value={filters.version || ""}
            onChange={(e) => onFilterChange("version", e.target.value)}
            placeholder="All versions"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export default PayrollFilters
