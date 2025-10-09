"use client"

import { useState, useEffect } from "react"
import { X, Loader } from "lucide-react"
import { userAPI } from "../../utils/api"

const EditUserModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE",
    employee_id: "",
    is_active: true,
  })
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        employee_id: user.employee_id || "",
        is_active: user.is_active,
      })
      if (user.role === "EMPLOYEE") {
        fetchEmployeesWithoutAccounts()
      }
    }
  }, [isOpen, user])

  const fetchEmployeesWithoutAccounts = async () => {
    setLoadingEmployees(true)
    try {
      const response = await userAPI.getEmployeesWithoutAccounts()
      setEmployees(response?.data?.employees || [])
    } catch (err) {
      console.error("Failed to fetch employees:", err)
    } finally {
      setLoadingEmployees(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const submitData = { ...formData }
      if (formData.role !== "EMPLOYEE") {
        delete submitData.employee_id
      }

      await userAPI.update(user.id, submitData)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || "Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit User</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value, employee_id: "" })}
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPERADMIN">Super Admin</option>
            </select>
          </div>

          {formData.role === "EMPLOYEE" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Link to Employee *
              </label>
              {loadingEmployees ? (
                <div className="flex items-center justify-center py-4">
                  <Loader className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              ) : (
                <select
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select an employee</option>
                  {user.employee && (
                    <option value={user.employee_id}>
                      {user.employee.name} - {user.employee.department} (Current)
                    </option>
                  )}
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department} ({emp.role})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserModal
