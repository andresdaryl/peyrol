"use client"

import { useState, useEffect } from "react"
import { holidayAPI } from "../utils/api"
import { Calendar, Plus, Edit2, Trash2, AlertCircle, CheckCircle, Upload } from "lucide-react"

const Holidays = () => {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filterYear, setFilterYear] = useState(new Date().getFullYear())
  const [filterType, setFilterType] = useState("all")
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    holiday_type: "regular_holiday",
    description: "",
    is_recurring: false,
  })
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    fetchHolidays()
  }, [filterYear])

  const fetchHolidays = async () => {
    try {
      setLoading(true)
      const response = await holidayAPI.getAll({ year: filterYear })
      setHolidays(response.data)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load holidays" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage({ type: "", text: "" })

    try {
      if (editingId) {
        await holidayAPI.update(editingId, formData)
        setMessage({ type: "success", text: "Holiday updated successfully!" })
      } else {
        await holidayAPI.create(formData)
        setMessage({ type: "success", text: "Holiday created successfully!" })
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({
        name: "",
        date: "",
        holiday_type: "regular_holiday",
        description: "",
        is_recurring: false,
      })
      fetchHolidays()
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to save holiday" })
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (holiday) => {
    setEditingId(holiday.id)
    setFormData({
      name: holiday.name,
      date: holiday.date,
      holiday_type: holiday.holiday_type,
      description: holiday.description || "",
      is_recurring: holiday.is_recurring || false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return

    try {
      await holidayAPI.delete(id)
      setMessage({ type: "success", text: "Holiday deleted successfully!" })
      fetchHolidays()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete holiday" })
    }
  }

  const handleBulkCreate = async () => {
    if (!window.confirm("Create Philippine 2025 holidays? This will add 12 holidays.")) return

    const philippineHolidays = [
      { name: "New Year's Day", date: "2025-01-01", holiday_type: "regular_holiday", is_recurring: true },
      { name: "EDSA Revolution", date: "2025-02-25", holiday_type: "special_holiday", is_recurring: true },
      { name: "Maundy Thursday", date: "2025-04-17", holiday_type: "regular_holiday", is_recurring: false },
      { name: "Good Friday", date: "2025-04-18", holiday_type: "regular_holiday", is_recurring: false },
      { name: "Labor Day", date: "2025-05-01", holiday_type: "regular_holiday", is_recurring: true },
      { name: "Independence Day", date: "2025-06-12", holiday_type: "regular_holiday", is_recurring: true },
      { name: "Ninoy Aquino Day", date: "2025-08-21", holiday_type: "special_holiday", is_recurring: true },
      { name: "National Heroes Day", date: "2025-08-25", holiday_type: "regular_holiday", is_recurring: true },
      { name: "All Saints' Day", date: "2025-11-01", holiday_type: "special_holiday", is_recurring: true },
      { name: "Bonifacio Day", date: "2025-11-30", holiday_type: "regular_holiday", is_recurring: true },
      { name: "Christmas Day", date: "2025-12-25", holiday_type: "regular_holiday", is_recurring: true },
      { name: "Rizal Day", date: "2025-12-30", holiday_type: "regular_holiday", is_recurring: true },
    ]

    try {
      await holidayAPI.bulkCreate(philippineHolidays)
      setMessage({ type: "success", text: "Philippine 2025 holidays created successfully!" })
      fetchHolidays()
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to create holidays" })
    }
  }

  const filteredHolidays = holidays.filter((holiday) => {
    const matchesType = filterType === "all" || holiday.holiday_type === filterType
    return matchesType
  })

  const getTypeColor = (type) => {
    return type === "regular_holiday"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
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
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white" data-testid="holidays-title">
            Holidays
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage company holidays and special non-working days
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleBulkCreate}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Upload className="w-5 h-5" />
            <span>PH 2025</span>
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                name: "",
                date: "",
                holiday_type: "regular_holiday",
                description: "",
                is_recurring: false,
              })
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Holiday</span>
          </button>
        </div>
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

      {/* Form */}
      {showForm && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-amber-200 dark:border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
            {editingId ? "Edit Holiday" : "Add New Holiday"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Holiday Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., New Year's Day"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Holiday Type
                </label>
                <select
                  value={formData.holiday_type}
                  onChange={(e) => setFormData({ ...formData, holiday_type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="regular_holiday">Regular Holiday</option>
                  <option value="special_holiday">Special Holiday</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_recurring}
                    onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Recurring Annually</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  rows="3"
                  placeholder="Additional details about this holiday..."
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {formLoading ? "Saving..." : editingId ? "Update Holiday" : "Create Holiday"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-amber-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
          >
            {[2024, 2025, 2026, 2027].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Types</option>
            <option value="regular_holiday">Regular Holiday</option>
            <option value="special_holiday">Special Holiday</option>
          </select>
        </div>
      </div>

      {/* Holidays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHolidays.length === 0 ? (
          <div className="col-span-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-12 border border-amber-200 dark:border-slate-700 text-center">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No holidays found for {filterYear}</p>
          </div>
        ) : (
          filteredHolidays.map((holiday) => (
            <div
              key={holiday.id}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-amber-200 dark:border-slate-700 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{holiday.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {new Date(holiday.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(holiday.holiday_type)}`}
                  >
                    {holiday.holiday_type === "regular_holiday" ? "Regular Holiday" : "Special Holiday"}
                  </span>
                  {holiday.is_recurring && (
                    <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Recurring
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(holiday)}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(holiday.id)}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {holiday.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  {holiday.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Holidays
