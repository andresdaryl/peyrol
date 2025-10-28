"use client"

import { Briefcase } from "lucide-react"

const LeaveBalanceModal = ({ show, loading, balance, onClose }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Leave Balance</h2>
          {balance && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{balance.employeeName}</p>}
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : balance ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Sick Leave
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Balance:</span>
                    <span className="font-bold">{balance.sick_leave?.balance || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Used:</span>
                    <span>{balance.sick_leave?.used || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{balance.sick_leave?.total || 0} days</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Vacation Leave
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Balance:</span>
                    <span className="font-bold">{balance.vacation_leave?.balance || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Used:</span>
                    <span>{balance.vacation_leave?.used || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{balance.vacation_leave?.total || 0} days</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Year: {balance.year || new Date().getFullYear()}
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
              No leave balance found. Initialize balance first.
            </p>
          )}
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeaveBalanceModal
