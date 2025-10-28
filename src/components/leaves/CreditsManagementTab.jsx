"use client"

import { Users, Calendar, TrendingUp, Gift } from "lucide-react"

const CreditsManagementTab = ({
  formLoading,
  onBulkInitialize,
  onAnnualReset,
  onViewBalanceSummary,
  onShowAssignCreditsModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Bulk Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Bulk Initialize</h3>
            <Users className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-sm mb-4 opacity-90">Initialize leave balances for all employees who don't have them yet</p>
          <button
            onClick={onBulkInitialize}
            disabled={formLoading}
            className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            Initialize All
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Annual Reset</h3>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-sm mb-4 opacity-90">Reset and add annual leave credits for all employees</p>
          <button
            onClick={onAnnualReset}
            disabled={formLoading}
            className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50"
          >
            Reset {new Date().getFullYear()}
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Balance Summary</h3>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-sm mb-4 opacity-90">View leave balance summary for all employees</p>
          <button
            onClick={onViewBalanceSummary}
            disabled={formLoading}
            className="w-full px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            View Summary
          </button>
        </div>
      </div>

      {/* Assign Credits Section */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Assign/Adjust Credits</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manually add or deduct leave credits for specific employees
            </p>
          </div>
          <button
            onClick={onShowAssignCreditsModal}
            className="flex items-center justify-center w-full space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all md:w-fit"
          >
            <Gift className="w-4 h-4" />
            <span>Assign Credits</span>
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Use positive numbers to add credits, negative numbers to deduct. For example: +5 adds 5 days, -2 deducts 2
          days.
        </p>
      </div>
    </div>
  )
}

export default CreditsManagementTab
