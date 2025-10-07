"use client"

import { Edit, Trash2, ArrowUpDown } from "lucide-react"

const AttendanceTable = ({ attendance, handleSort, sortBy, handleEdit, handleDelete, getEmployeeName }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
            <th
              className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-amber-600"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center space-x-1">
                <span>Date</span>
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </th>
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
          {attendance.length === 0 ? (
            <tr>
              <td colSpan="9" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No attendance records found
              </td>
            </tr>
          ) : (
            attendance.map((record) => (
              <tr key={record.id} className="hover:bg-amber-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                  {getEmployeeName(record.employee_id)}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{record.date}</td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{record.time_in}</td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{record.time_out}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.shift_type === "day"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : record.shift_type === "night"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    }`}
                  >
                    {record.shift_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{record.overtime_hours}h</td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {record.late_deduction?.amount > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        ₱{record.late_deduction.amount.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({record.late_deduction.minutes} min)
                      </span>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4">
                  {record.total_deductions > 0 ? (
                    <span className="text-red-600 dark:text-red-400 font-bold">
                      ₱{record.total_deductions.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AttendanceTable
