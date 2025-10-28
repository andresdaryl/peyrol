"use client"

import { Edit, Trash2, UserCheck, UserX, Briefcase, Gift } from "lucide-react"

const EmployeeTableRow = ({ employee, onEdit, onViewBalance, onInitializeBalance, onDelete }) => {
  return (
    <tr
      className="hover:bg-amber-50 dark:hover:bg-slate-700/50 transition-colors"
      data-testid={`employee-row-${employee.id}`}
    >
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-slate-800 dark:text-white">{employee.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{employee.contact}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{employee.role}</td>
      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{employee.department || "-"}</td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {employee.salary_type}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">₱{employee.salary_rate.toFixed(2)}</td>
      <td className="px-6 py-4">
        {employee.status === "active" ? (
          <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
            <UserCheck className="w-4 h-4" />
            <span className="text-sm font-medium">Active</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1 text-red-600 dark:text-red-400">
            <UserX className="w-4 h-4" />
            <span className="text-sm font-medium">Inactive</span>
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
            data-testid={`edit-employee-${employee.id}`}
            title="Edit Employee"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewBalance(employee)}
            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
            title="View Leave Balance"
          >
            <Briefcase className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInitializeBalance(employee.id)}
            className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 transition-colors"
            title="Initialize Leave Balance"
          >
            <Gift className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
            data-testid={`delete-employee-${employee.id}`}
            title="Deactivate Employee"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default EmployeeTableRow
