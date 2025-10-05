"use client"

import { useState, useEffect } from "react"
import { leaveAPI, employeeAPI } from "../utils/api"
import {
  Briefcase,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Search,
  Users,
  Gift,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Leaves = () => {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [leaveBalance, setLeaveBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("requests") // "requests" or "credits"
  const [showAssignCreditsModal, setShowAssignCreditsModal] = useState(false)
  const [showBalanceSummaryModal, setShowBalanceSummaryModal] = useState(false)
  const [balanceSummary, setBalanceSummary] = useState([])
  const [assignCreditsForm, setAssignCreditsForm] = useState({
    employee_id: "",
    sick_leave: "",
    vacation_leave: "",
    reason: "",
  })
  const [formData, setFormData] = useState({
    employee_id: "",
    leave_type: "sick_leave",
    start_date: "",
    end_date: "",
    reason: "",
    attachment_url: "",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [leavesRes, employeesRes] = await Promise.all([leaveAPI.getAll(), employeeAPI.getAll()])
      setLeaves(leavesRes.data)
      setEmployees(employeesRes.data?.data)

      // Fetch leave balance for current user if they're an employee
      if (user?.employee_id) {
        const balanceRes = await leaveAPI.getBalance(user.employee_id)
        setLeaveBalance(balanceRes.data)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load data" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await leaveAPI.request(formData)
      setMessage({
        type: "success",
        text: `Leave request submitted! ${response.data.days_count} working days will be deducted if approved.`,
      })
      setShowForm(false)
      setFormData({
        employee_id: "",
        leave_type: "sick_leave",
        start_date: "",
        end_date: "",
        reason: "",
        attachment_url: "",
      })
      fetchData()
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to submit leave request" })
    } finally {
      setFormLoading(false)
    }
  }

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      await leaveAPI.update(leaveId, { status })
      setMessage({ type: "success", text: `Leave ${status} successfully!` })
      fetchData()
    } catch (error) {
      setMessage({ type: "error", text: `Failed to ${status} leave` })
    }
  }

  const handleBulkInitialize = async () => {
    if (
      window.confirm(
        "Initialize leave balances for ALL employees? This will set up annual leave credits for employees who don't have them yet.",
      )
    ) {
      try {
        setFormLoading(true)
        const response = await leaveAPI.bulkInitialize()
        setMessage({
          type: "success",
          text: `Successfully initialized ${response.data.initialized_count} employee leave balances!`,
        })
      } catch (error) {
        setMessage({ type: "error", text: error.response?.data?.message || "Failed to bulk initialize" })
      } finally {
        setFormLoading(false)
      }
    }
  }

  const handleAnnualReset = async () => {
    const currentYear = new Date().getFullYear()
    if (
      window.confirm(
        `Reset leave balances for year ${currentYear}? This will add annual leave credits to all employees.`,
      )
    ) {
      try {
        setFormLoading(true)
        const response = await leaveAPI.annualReset(currentYear)
        setMessage({
          type: "success",
          text: `Annual reset completed for ${response.data.reset_count} employees!`,
        })
      } catch (error) {
        setMessage({ type: "error", text: error.response?.data?.message || "Failed to perform annual reset" })
      } finally {
        setFormLoading(false)
      }
    }
  }

  const handleAssignCredits = async (e) => {
    e.preventDefault()
    try {
      setFormLoading(true)
      const response = await leaveAPI.assignCredits(
        assignCreditsForm.employee_id,
        Number.parseFloat(assignCreditsForm.sick_leave) || 0,
        Number.parseFloat(assignCreditsForm.vacation_leave) || 0,
        assignCreditsForm.reason,
      )
      setMessage({
        type: "success",
        text: "Leave credits adjusted successfully!",
      })
      setShowAssignCreditsModal(false)
      setAssignCreditsForm({
        employee_id: "",
        sick_leave: "",
        vacation_leave: "",
        reason: "",
      })
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to assign credits" })
    } finally {
      setFormLoading(false)
    }
  }

  const handleViewBalanceSummary = async () => {
    try {
      setFormLoading(true)
      const response = await leaveAPI.getBalanceSummary()
      setBalanceSummary(response.data.balances || [])
      setShowBalanceSummaryModal(true)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch balance summary" })
    } finally {
      setFormLoading(false)
    }
  }

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || leave.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getLeaveTypeLabel = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white" data-testid="leaves-title">
            Leaves
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Request and manage employee leave applications</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Request Leave</span>
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-2 ${message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs for switching between requests and credits management */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-amber-200 dark:border-slate-700 overflow-hidden">
        <div className="flex border-b border-amber-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700/50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Leave Requests</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("credits")}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === "credits"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700/50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Gift className="w-5 h-5" />
              <span>Credits Management</span>
            </div>
          </button>
        </div>
      </div>

      {activeTab === "credits" && (
        <div className="space-y-6">
          {/* Bulk Operations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bulk Initialize</h3>
                <Users className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-sm mb-4 opacity-90">
                Initialize leave balances for all employees who don't have them yet
              </p>
              <button
                onClick={handleBulkInitialize}
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
                onClick={handleAnnualReset}
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
                onClick={handleViewBalanceSummary}
                disabled={formLoading}
                className="w-full px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                View Summary
              </button>
            </div>
          </div>

          {/* Assign Credits Section */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-amber-200 dark:border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Assign/Adjust Credits</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Manually add or deduct leave credits for specific employees
                </p>
              </div>
              <button
                onClick={() => setShowAssignCreditsModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
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
      )}

      {/* Leave Requests Tab Content */}
      {activeTab === "requests" && (
        <>
          {/* Leave Balance */}
          {leaveBalance && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Sick Leave</h3>
                  <Briefcase className="w-8 h-8 opacity-80" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Balance:</span>
                    <span className="font-bold">{leaveBalance.sick_leave?.balance || 0} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Used:</span>
                    <span>{leaveBalance.sick_leave?.used || 0} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span>{leaveBalance.sick_leave?.total || 0} days</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Vacation Leave</h3>
                  <Briefcase className="w-8 h-8 opacity-80" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Balance:</span>
                    <span className="font-bold">{leaveBalance.vacation_leave?.balance || 0} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Used:</span>
                    <span>{leaveBalance.vacation_leave?.used || 0} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span>{leaveBalance.vacation_leave?.total || 0} days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Request Form */}
          {showForm && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-amber-200 dark:border-slate-700 shadow-xl">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Request Leave</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Employee
                    </label>
                    <select
                      value={formData.employee_id}
                      onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} - {emp.employee_id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Leave Type
                    </label>
                    <select
                      value={formData.leave_type}
                      onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="sick_leave">Sick Leave</option>
                      <option value="vacation_leave">Vacation Leave</option>
                      <option value="emergency_leave">Emergency Leave</option>
                      <option value="maternity_leave">Maternity Leave</option>
                      <option value="paternity_leave">Paternity Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reason</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                      rows="3"
                      placeholder="Explain the reason for your leave..."
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Attachment URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.attachment_url}
                      onChange={(e) => setFormData({ ...formData, attachment_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                      placeholder="https://example.com/medical-certificate.pdf"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {formLoading ? "Submitting..." : "Submit Request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-amber-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by employee name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-amber-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-100 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Leave Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Days
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredLeaves.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                        No leave requests found
                      </td>
                    </tr>
                  ) : (
                    filteredLeaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-amber-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-800 dark:text-white font-medium">
                          {leave.employee_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {getLeaveTypeLabel(leave.leave_type)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{leave.start_date}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{leave.end_date}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {leave.days_count || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {leave.status === "pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(leave.id, "approved")}
                                className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(leave.id, "rejected")}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showAssignCreditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Assign/Adjust Leave Credits</h2>
            </div>
            <form onSubmit={handleAssignCredits} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Employee *</label>
                <select
                  value={assignCreditsForm.employee_id}
                  onChange={(e) => setAssignCreditsForm({ ...assignCreditsForm, employee_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sick Leave Adjustment
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={assignCreditsForm.sick_leave}
                  onChange={(e) => setAssignCreditsForm({ ...assignCreditsForm, sick_leave: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., 5 to add, -2 to deduct"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Positive to add, negative to deduct</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Vacation Leave Adjustment
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={assignCreditsForm.vacation_leave}
                  onChange={(e) => setAssignCreditsForm({ ...assignCreditsForm, vacation_leave: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., 5 to add, -2 to deduct"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Positive to add, negative to deduct</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reason *</label>
                <textarea
                  value={assignCreditsForm.reason}
                  onChange={(e) => setAssignCreditsForm({ ...assignCreditsForm, reason: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  rows="3"
                  placeholder="Explain the reason for this adjustment..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {formLoading ? "Processing..." : "Assign Credits"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignCreditsModal(false)
                    setAssignCreditsForm({
                      employee_id: "",
                      sick_leave: "",
                      vacation_leave: "",
                      reason: "",
                    })
                  }}
                  className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBalanceSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Leave Balance Summary</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">All employees ({balanceSummary.length})</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {formLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-amber-100 dark:bg-slate-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Sick Leave
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Vacation Leave
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {balanceSummary.map((balance, index) => (
                        <tr key={index} className="hover:bg-amber-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3 text-sm text-slate-800 dark:text-white font-medium">
                            {balance.employee_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {balance.department || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="space-y-1">
                              <div>
                                Balance:{" "}
                                <span className="font-medium text-green-600 dark:text-green-400">
                                  {balance.sick_leave?.balance || 0}
                                </span>
                              </div>
                              <div className="text-xs">
                                Used: {balance.sick_leave?.used || 0} / Total: {balance.sick_leave?.total || 0}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="space-y-1">
                              <div>
                                Balance:{" "}
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                  {balance.vacation_leave?.balance || 0}
                                </span>
                              </div>
                              <div className="text-xs">
                                Used: {balance.vacation_leave?.used || 0} / Total: {balance.vacation_leave?.total || 0}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowBalanceSummaryModal(false)}
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

export default Leaves
