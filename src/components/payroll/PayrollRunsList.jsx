"use client"
import { useState } from "react"
import { Filter, X } from "lucide-react"

const PayrollRunsList = ({ runs, selectedRun, onSelectRun, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    type: "",
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = { start_date: "", end_date: "", type: "" }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = filters.start_date || filters.end_date || filters.type

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Payroll Runs</h2>
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
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filter Runs</h3>
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

          <div className="space-y-2">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange("start_date", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange("end_date", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="regular">Regular</option>
                <option value="special">Special</option>
                <option value="13th_month">13th Month</option>
                <option value="bonus">Bonus</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {runs.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No runs yet</p>
      ) : (
        runs.map((run) => (
          <div
            key={run.id}
            onClick={() => onSelectRun(run)}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              selectedRun?.id === run.id
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                : "bg-white/70 dark:bg-slate-800/70 hover:shadow-lg border border-slate-200 dark:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold dark:text-gray-200">{run.type}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  run.status === "draft"
                    ? "bg-yellow-200 text-yellow-800"
                    : run.status === "finalized"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-800"
                }`}
              >
                {run.status}
              </span>
            </div>
            <p className="text-sm opacity-90 dark:text-gray-200">
              {run.start_date} to {run.end_date}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default PayrollRunsList
