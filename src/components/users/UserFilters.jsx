"use client"

import { Search, Filter } from "lucide-react"

const UserFilters = ({ filters, onFilterChange, onSearch }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Search by Name or Email
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange("role", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="">All Roles</option>
            <option value="SUPERADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
          <select
            value={filters.is_active}
            onChange={(e) => onFilterChange("is_active", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={onSearch}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default UserFilters
