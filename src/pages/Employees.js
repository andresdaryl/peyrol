"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Briefcase,
  Gift,
} from "lucide-react"
import { employeeAPI, leaveAPI } from "../utils/api"
import { toast } from "sonner"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    role: "",
    department: "",
    salary_type: "daily",
    salary_rate: "",
    overtime_rate: "",
    nightshift_rate: "",
    benefits: {},
    taxes: {},
  })

  const [showLeaveBalanceModal, setShowLeaveBalanceModal] = useState(false)
  const [selectedEmployeeBalance, setSelectedEmployeeBalance] = useState(null)
  const [loadingBalance, setLoadingBalance] = useState(false)

  useEffect(() => {
    fetchEmployees()
  }, [page, searchTerm, statusFilter, sortBy, sortOrder])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      })

      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter) params.append("status", statusFilter)

      const response = await employeeAPI.getAll(params)
      setEmployees(response.data.data)
      setTotal(response.data.total)
      setTotalPages(response.data.pages)
    } catch (error) {
      toast.error("Failed to fetch employees")
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...formData,
        salary_rate: Number.parseFloat(formData.salary_rate),
        overtime_rate: formData.overtime_rate ? Number.parseFloat(formData.overtime_rate) : null,
        nightshift_rate: formData.nightshift_rate ? Number.parseFloat(formData.nightshift_rate) : null,
      }

      if (editingEmployee) {
        await employeeAPI.update(editingEmployee.id, dataToSend)
        toast.success("Employee updated successfully")
      } else {
        await employeeAPI.create(dataToSend)
        toast.success("Employee created successfully")
      }

      fetchEmployees()
      setShowModal(false)
      resetForm()
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      contact: employee.contact,
      role: employee.role,
      department: employee.department || "",
      salary_type: employee.salary_type,
      salary_rate: employee.salary_rate,
      overtime_rate: employee.overtime_rate || "",
      nightshift_rate: employee.nightshift_rate || "",
      benefits: employee.benefits || {},
      taxes: employee.taxes || {},
    })
    setShowModal(true)
  }

  const handleInitializeBalance = async (employeeId) => {
    if (window.confirm("Initialize leave balance for this employee? This will set up their annual leave credits.")) {
      try {
        const response = await leaveAPI.initializeBalance(employeeId)
        toast.success(
          `Leave balance initialized! ${response.data.sick_leave_credits} sick days, ${response.data.vacation_leave_credits} vacation days`,
        )
        fetchEmployees()
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to initialize leave balance")
      }
    }
  }

  const handleViewBalance = async (employee) => {
    setLoadingBalance(true)
    setShowLeaveBalanceModal(true)
    try {
      const response = await leaveAPI.getBalance(employee.id)
      setSelectedEmployeeBalance({ ...response.data, employeeName: employee.name })
    } catch (error) {
      toast.error("Failed to fetch leave balance")
      setShowLeaveBalanceModal(false)
    } finally {
      setLoadingBalance(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this employee?")) {
      try {
        await employeeAPI.delete(id)
        toast.success("Employee deactivated")
        fetchEmployees()
      } catch (error) {
        toast.error("Failed to deactivate employee")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      contact: "",
      role: "",
      department: "",
      salary_type: "daily",
      salary_rate: "",
      overtime_rate: "",
      nightshift_rate: "",
      benefits: {},
      taxes: {},
    })
    setEditingEmployee(null)
  }

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white" data-testid="employees-title">
            Employees
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your team members ({total} total)</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          data-testid="add-employee-button"
        >
          <Plus className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
                placeholder="Search by name, role, or department..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
                data-testid="employee-search"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white"
              data-testid="status-filter"
            >
              <option value="">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <tr>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-amber-600"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-amber-600"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Salary Type</th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-amber-600"
                  onClick={() => handleSort("salary_rate")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Rate</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees?.map((employee) => (
                  <tr
                    key={employee.id}
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
                          onClick={() => handleEdit(employee)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                          data-testid={`edit-employee-${employee.id}`}
                          title="Edit Employee"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewBalance(employee)}
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                          title="View Leave Balance"
                        >
                          <Briefcase className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInitializeBalance(employee.id)}
                          className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 transition-colors"
                          title="Initialize Leave Balance"
                        >
                          <Gift className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                          data-testid={`delete-employee-${employee.id}`}
                          title="Deactivate Employee"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} employees
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-testid="prev-page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-testid="next-page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
                    required
                    data-testid="employee-form-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contact *</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
                    required
                    data-testid="employee-form-contact"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
                    required
                    data-testid="employee-form-role"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
                    data-testid="employee-form-department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Salary Type *
                  </label>
                  <select
                    value={formData.salary_type}
                    onChange={(e) => setFormData({ ...formData, salary_type: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
                    data-testid="employee-form-salary-type"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Salary Rate *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salary_rate}
                    onChange={(e) => setFormData({ ...formData, salary_rate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
                    required
                    data-testid="employee-form-salary-rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Overtime Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.overtime_rate}
                    onChange={(e) => setFormData({ ...formData, overtime_rate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
                    data-testid="employee-form-overtime-rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Night Shift Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.nightshift_rate}
                    onChange={(e) => setFormData({ ...formData, nightshift_rate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-white"
                    data-testid="employee-form-nightshift-rate"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  data-testid="employee-form-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                  data-testid="employee-form-submit"
                >
                  {editingEmployee ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Balance Modal */}
      {showLeaveBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Leave Balance</h2>
              {selectedEmployeeBalance && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {selectedEmployeeBalance.employeeName}
                </p>
              )}
            </div>
            <div className="p-6">
              {loadingBalance ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : selectedEmployeeBalance ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                    <h3 className="text-sm font-semibold mb-3 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Sick Leave
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Balance:</span>
                        <span className="font-bold">{selectedEmployeeBalance.sick_leave?.balance || 0} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Used:</span>
                        <span>{selectedEmployeeBalance.sick_leave?.used || 0} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>{selectedEmployeeBalance.sick_leave?.total || 0} days</span>
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
                        <span className="font-bold">{selectedEmployeeBalance.vacation_leave?.balance || 0} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Used:</span>
                        <span>{selectedEmployeeBalance.vacation_leave?.used || 0} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>{selectedEmployeeBalance.vacation_leave?.total || 0} days</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    Year: {selectedEmployeeBalance.year || new Date().getFullYear()}
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
                onClick={() => {
                  setShowLeaveBalanceModal(false)
                  setSelectedEmployeeBalance(null)
                }}
                className="w-full px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees
