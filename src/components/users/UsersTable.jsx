"use client"

import { Edit, Trash2, CheckCircle, XCircle, Key } from "lucide-react"

const UsersTable = ({ users, loading, onEdit, onDelete, onActivate, onResetPassword }) => {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "ADMIN":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "EMPLOYEE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
        <p className="text-slate-500 dark:text-slate-400">No users found</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {user.employee?.profile_image_url ? (
                      <img
                        src={user.employee.profile_image_url || "/placeholder.svg"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-slate-800 dark:text-white">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {user.employee ? (
                    <div>
                      <div className="font-medium">{user.employee.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {user.employee.department} - {user.employee.role}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.is_active ? (
                    <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Active</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Inactive</span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{formatDate(user.created_at)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onResetPassword(user)}
                      className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                      title="Reset Password"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    {user.is_active ? (
                      <button
                        onClick={() => onDelete(user)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Deactivate User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(user)}
                        className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        title="Activate User"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersTable
