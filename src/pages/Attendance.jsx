"use client"

import { useState, useEffect } from "react"
import { Plus, Upload } from "lucide-react"
import { attendanceAPI, employeeAPI } from "../utils/api"
import { toast } from "sonner"
import AttendanceFilters from "../components/attendance/AttendanceFilters"
import AttendanceTable from "../components/attendance/AttendanceTable"
import AttendanceTableSkeleton from "../components/attendance/AttendanceTableSkeleton"
import AttendanceModal from "../components/attendance/AttendanceModal"
import ImportModal from "../components/attendance/ImportModal"
import Pagination from "../components/attendance/Pagination"

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [employeeFilter, setEmployeeFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showModal, setShowModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [formData, setFormData] = useState({
    employee_id: "",
    date: new Date().toISOString().split("T")[0],
    time_in: "08:00",
    time_out: "17:00",
    shift_type: "day",
    overtime_hours: 0,
    nightshift_hours: 0,
    notes: "",
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    fetchAttendance()
  }, [page, employeeFilter, sortBy, sortOrder])

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams({ limit: "1000" })
      const response = await employeeAPI.getAll(params)
      setEmployees(response.data.data.filter((e) => e.status === "active"))
    } catch (error) {
      toast.error("Failed to fetch employees")
    }
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      })

      if (employeeFilter) params.append("employee_id", employeeFilter)

      const response = await attendanceAPI.getAll(params)
      setAttendance(response.data.data)
      setTotal(response.data.total)
      setTotalPages(response.data.pages)
    } catch (error) {
      toast.error("Failed to fetch attendance")
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
        overtime_hours: Number.parseFloat(formData.overtime_hours),
        nightshift_hours: Number.parseFloat(formData.nightshift_hours),
      }

      if (editingRecord) {
        await attendanceAPI.update(editingRecord.id, dataToSend)
        toast.success("Attendance updated")
      } else {
        await attendanceAPI.create(dataToSend)
        toast.success("Attendance recorded")
      }

      fetchAttendance()
      setShowModal(false)
      resetForm()
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setFormData({
      employee_id: record.employee_id,
      date: record.date,
      time_in: record.time_in,
      time_out: record.time_out,
      shift_type: record.shift_type,
      overtime_hours: record.overtime_hours,
      nightshift_hours: record.nightshift_hours,
      notes: record.notes || "",
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Delete this attendance record?")) {
      try {
        await attendanceAPI.delete(id)
        toast.success("Attendance deleted")
        fetchAttendance()
      } catch (error) {
        toast.error("Failed to delete")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      employee_id: "",
      date: new Date().toISOString().split("T")[0],
      time_in: "08:00",
      time_out: "17:00",
      shift_type: "day",
      overtime_hours: 0,
      nightshift_hours: 0,
      notes: "",
    })
    setEditingRecord(null)
  }

  const getEmployeeName = (empId) => {
    const emp = employees.find((e) => e.id === empId)
    return emp ? emp.name : "Unknown"
  }

  const handleImportSuccess = () => {
    fetchAttendance()
    toast.success("Attendance imported successfully")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white" data-testid="attendance-title">
            Attendance
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track employee work hours and deductions ({total} records)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            data-testid="import-attendance-button"
          >
            <Upload className="w-5 h-5" />
            <span>Import</span>
          </button>
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            data-testid="add-attendance-button"
          >
            <Plus className="w-5 h-5" />
            <span>Add Attendance</span>
          </button>
        </div>
      </div>

      <AttendanceFilters
        employeeFilter={employeeFilter}
        setEmployeeFilter={setEmployeeFilter}
        employees={employees}
        setPage={setPage}
      />

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <AttendanceTableSkeleton />
        ) : (
          <AttendanceTable
            attendance={attendance}
            handleSort={handleSort}
            sortBy={sortBy}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            getEmployeeName={getEmployeeName}
          />
        )}

        <Pagination page={page} setPage={setPage} totalPages={totalPages} limit={limit} total={total} />
      </div>

      <AttendanceModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingRecord={editingRecord}
        formData={formData}
        setFormData={setFormData}
        employees={employees}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

      <ImportModal
        showModal={showImportModal}
        setShowModal={setShowImportModal}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  )
}

export default Attendance
