"use client"

import { useState, useEffect } from "react"
import { leaveAPI, employeeAPI } from "../utils/api"
import { Plus, CheckCircle, AlertCircle, FileText, Gift } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import LeaveBalanceCards from "../components/leaves/LeaveBalanceCards"
import LeaveRequestModal from "@/components/leaves/LeaveRequestModal"
import LeaveFilters from "../components/leaves/LeaveFilters"
import LeaveRequestsTable from "../components/leaves/LeaveRequestsTable"
import CreditsManagementTab from "../components/leaves/CreditsManagementTab"
import AssignCreditsModal from "../components/leaves/AssignCreditsModal"
import BalanceSummaryModal from "../components/leaves/BalanceSummaryModal"
import TableSkeleton from "../components/leaves/TableSkeleton"
import CreditsAuditTable from "../components/leaves/CreditsAuditTable"
import useDebounce from "@/hooks/use-debounce"

const Leaves = () => {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [leaveBalance, setLeaveBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterLeaveType, setFilterLeaveType] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState("requests")
  const [showAssignCreditsModal, setShowAssignCreditsModal] = useState(false)
  const [showBalanceSummaryModal, setShowBalanceSummaryModal] = useState(false)
  const [balanceSummary, setBalanceSummary] = useState([])
  const [creditAudit, setCreditAudit] = useState(null)
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

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const fetchLeaves = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterLeaveType !== "all" && { leave_type: filterLeaveType }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
        ...(debouncedSearchTerm && { employee_id: debouncedSearchTerm }),
      }

      const res = await leaveAPI.getAll(params)
      setLeaves(res?.data.data)
    } catch (err) {
      console.error("Failed to fetch leaves:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchLeaves()
  }, [page, debouncedSearchTerm, filterStatus, filterLeaveType, startDate, endDate])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [employeesRes] = await Promise.all([leaveAPI.getAll(), employeeAPI.getAll()])
      setEmployees(employeesRes?.data?.data)

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
        text: `Leave request submitted! ${response.data?.data?.days_count} working days will be deducted if approved.`,
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
          text: `Successfully initialized ${response.data?.data?.initialized_count} employee leave balances!`,
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
          text: `Annual reset completed for ${response.data?.data?.reset_count} employees!`,
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
      setCreditAudit(response.data)
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
      setBalanceSummary(response.data?.data?.balances || [])
      setShowBalanceSummaryModal(true)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch balance summary" })
    } finally {
      setFormLoading(false)
    }
  }

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

  return (
    <div className="flex flex-col gap-6">
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

      {/* Tabs */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex">
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
        <CreditsManagementTab
          formLoading={formLoading}
          onBulkInitialize={handleBulkInitialize}
          onAnnualReset={handleAnnualReset}
          onViewBalanceSummary={handleViewBalanceSummary}
          onShowAssignCreditsModal={() => setShowAssignCreditsModal(true)}
        />
      )}

      {activeTab === "requests" && (
        <>
          <LeaveBalanceCards leaveBalance={leaveBalance} />

          <LeaveRequestModal
            show={showForm}
            employees={employees}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
            formLoading={formLoading}
          />

          <LeaveFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterLeaveType={filterLeaveType}
            setFilterLeaveType={setFilterLeaveType}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setPage={setPage}
          />

          {loading ? (
            <TableSkeleton rows={5} />
          ) : (
            <LeaveRequestsTable
              leaves={leaves}
              onStatusUpdate={handleStatusUpdate}
              getStatusColor={getStatusColor}
              getLeaveTypeLabel={getLeaveTypeLabel}
            />
          )}
        </>
      )}

      <AssignCreditsModal
        show={showAssignCreditsModal}
        formData={assignCreditsForm}
        setFormData={setAssignCreditsForm}
        employees={employees}
        formLoading={formLoading}
        onSubmit={handleAssignCredits}
        onClose={() => {
          setShowAssignCreditsModal(false)
          setAssignCreditsForm({
            employee_id: "",
            sick_leave: "",
            vacation_leave: "",
            reason: "",
          })
        }}
      />

      <BalanceSummaryModal
        show={showBalanceSummaryModal}
        balanceSummary={balanceSummary}
        formLoading={formLoading}
        onClose={() => setShowBalanceSummaryModal(false)}
      />

      <CreditsAuditTable
        auditData={creditAudit}
        onClose={() => setCreditAudit(null)}
      />
    </div>
  )
}

export default Leaves
