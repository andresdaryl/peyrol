"use client"

import { Search, Filter } from "lucide-react"

const UserFilters = ({ filters, onFilterChange, onSearch }) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
              data-testid="user-search"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="md:col-span-1">
          <select
            value={filters.role}
            onChange={(e) => onFilterChange("role", e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white"
            data-testid="role-filter"
          >
            <option value="">All Roles</option>
            <option value="SUPERADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.is_active}
            onChange={(e) => onFilterChange("is_active", e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white"
            data-testid="status-filter"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default UserFilters
