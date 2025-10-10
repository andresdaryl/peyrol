"use client"

import { CheckCircle, XCircle, FileText } from "lucide-react"

const LeaveRequestsTable = ({ leaves, onStatusUpdate, getStatusColor, getLeaveTypeLabel }) => {
  if (leaves.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Leave Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  End Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Days</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No leave requests found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
        <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Leave Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Start Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">End Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Days</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-amber-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-800 dark:text-white font-medium">
                  {leave.employee_name || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {getLeaveTypeLabel(leave.leave_type)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{leave.start_date}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{leave.end_date}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{leave.days_count || 0}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {leave.status === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onStatusUpdate(leave.id, "approved")}
                        className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onStatusUpdate(leave.id, "rejected")}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {leave.attachment_url && (
                    <a
                      href={leave.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View</span>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeaveRequestsTable
