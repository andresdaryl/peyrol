"use client"

import { useState, useEffect } from "react"
import { Plus, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { employeeAPI, leaveAPI } from "@/utils/api"
import { toast } from "sonner"
import EmployeeTableSkeleton from "@/components/employees/EmployeeTableSkeleton"
import EmployeeFilters from "@/components/employees/EmployeeFilters"
import EmployeeTableRow from "@/components/employees/EmployeeTableRow"
import EmployeeModal from "@/components/employees/EmployeeModal"
import LeaveBalanceModal from "@/components/employees/LeaveBalanceModal"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
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
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [searchTerm])

  useEffect(() => {
    fetchEmployees()
  }, [page, debouncedSearchTerm, statusFilter, sortBy, sortOrder])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      })

      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm)
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

  // if (loading && page === 1 && !debouncedSearchTerm) {
  //   return <EmployeeTableSkeleton />
  // }

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

      <EmployeeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setPage={setPage}
        isSearching={isSearching}
      />

      {/* Employee Table */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        )}

        {!loading ? (
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
                  <EmployeeTableRow
                    key={employee.id}
                    employee={employee}
                    onEdit={handleEdit}
                    onViewBalance={handleViewBalance}
                    onInitializeBalance={handleInitializeBalance}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>                
        ) : (
          <EmployeeTableSkeleton />
        )}

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

      <EmployeeModal
        show={showModal}
        editingEmployee={editingEmployee}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
      />

      <LeaveBalanceModal
        show={showLeaveBalanceModal}
        loading={loadingBalance}
        balance={selectedEmployeeBalance}
        onClose={() => {
          setShowLeaveBalanceModal(false)
          setSelectedEmployeeBalance(null)
        }}
      />
    </div>
  )
}

export default Employees
