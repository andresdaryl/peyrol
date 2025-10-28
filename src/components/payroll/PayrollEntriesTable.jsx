"use client"
import { useState } from "react"
import { Edit2, Filter, X } from "lucide-react"

const PayrollEntriesTable = ({ entries, selectedRun, onEditEntry, employees, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    employee_id: "",
    version: "",
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = { employee_id: "", version: "" }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = filters.employee_id || filters.version

  if (entries.length === 0 && !hasActiveFilters) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Payroll Entries</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-all ${
            hasActiveFilters
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
              : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {showFilters && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filter Entries</h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Employee</label>
              <select
                value={filters.employee_id}
                onChange={(e) => handleFilterChange("employee_id", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Version</label>
              <input
                type="number"
                value={filters.version}
                onChange={(e) => handleFilterChange("version", e.target.value)}
                placeholder="Enter version"
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            No entries found with current filters
          </div>
        ) : (
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
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-amber-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 text-slate-800 dark:text-white">{entry.employee_name}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">₱{entry.base_pay?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">₱{entry.overtime_pay?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">₱{entry.gross?.toFixed(2)}</td>
                    <td className="px-4 py-3 font-bold text-green-600">₱{entry.net?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onEditEntry(entry)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedRun.status !== "draft"}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PayrollEntriesTable
