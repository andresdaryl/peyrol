"use client"

import { useState, useEffect } from "react"
import { benefitsConfigAPI } from "../utils/api"
import { Plus, Edit, Trash2, Calculator } from "lucide-react"

const BenefitsConfig = () => {
  const [configs, setConfigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    benefit_type: "",
    year: "",
    is_active: undefined,
  })

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    benefit_type: "sss",
    year: new Date().getFullYear().toString(),
    config_data: "{}",
    notes: "",
  })

  // Preview states
  const [previewData, setPreviewData] = useState({
    benefit_type: "all",
    monthly_salary: 20000,
  })
  const [previewResult, setPreviewResult] = useState(null)

  useEffect(() => {
    fetchConfigs()
  }, [filters])

  const fetchConfigs = async () => {
    try {
      setLoading(true)
      const response = await benefitsConfigAPI.getAll(filters)
      setConfigs(response?.data?.data)
    } catch (error) {
      console.error("Error fetching configs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        config_data: JSON.parse(formData.config_data),
      }
      await benefitsConfigAPI.create(payload)
      setShowCreateModal(false)
      fetchConfigs()
      resetForm()
    } catch (error) {
      alert(error.message)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        config_data: JSON.parse(formData.config_data),
        notes: formData.notes,
        is_active: formData.is_active,
      }
      await benefitsConfigAPI.update(selectedConfig.id, payload)
      setShowEditModal(false)
      fetchConfigs()
      resetForm()
    } catch (error) {
      alert(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return
    try {
      await benefitsConfigAPI.delete(id)
      fetchConfigs()
    } catch (error) {
      alert(error.message)
    }
  }

  const handlePreview = async () => {
    try {
      const result = await benefitsConfigAPI.preview(previewData.benefit_type, previewData.monthly_salary)
      setPreviewResult(result)
    } catch (error) {
      alert(error.message)
    }
  }

  const openEditModal = (config) => {
    setSelectedConfig(config)
    setFormData({
      benefit_type: config.benefit_type,
      year: config.year,
      config_data: JSON.stringify(config.config_data, null, 2),
      notes: config.notes || "",
      is_active: config.is_active,
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      benefit_type: "sss",
      year: new Date().getFullYear().toString(),
      config_data: "{}",
      notes: "",
    })
    setSelectedConfig(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white" data-testid="benefits-config-title">
            Benefits Configuration
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage SSS, PhilHealth, and Pag-IBIG contribution tables
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Calculator className="w-4 h-4" />
            Preview Calculator
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Configuration
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Benefit Type</label>
            <select
              value={filters.benefit_type}
              onChange={(e) => setFilters({ ...filters, benefit_type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="sss">SSS</option>
              <option value="philhealth">PhilHealth</option>
              <option value="pagibig">Pag-IBIG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Year</label>
            <input
              type="text"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              placeholder="e.g., 2025"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Configs Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Benefit Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : configs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No configurations found
                  </td>
                </tr>
              ) : (
                configs.map((config) => (
                  <tr key={config.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 dark:text-white uppercase">
                        {config.benefit_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{config.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${config.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
                      >
                        {config.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {config.notes || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(config)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(config.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
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
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Create Benefits Configuration</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Benefit Type *
                  </label>
                  <select
                    value={formData.benefit_type}
                    onChange={(e) => setFormData({ ...formData, benefit_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    required
                  >
                    <option value="sss">SSS</option>
                    <option value="philhealth">PhilHealth</option>
                    <option value="pagibig">Pag-IBIG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Year *</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Configuration Data (JSON) *
                </label>
                <textarea
                  value={formData.config_data}
                  onChange={(e) => setFormData({ ...formData, config_data: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-mono text-sm"
                  rows="10"
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter valid JSON configuration data</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600"
                >
                  Create Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Benefits Configuration</h2>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  <strong>Type:</strong> {formData.benefit_type.toUpperCase()} | <strong>Year:</strong> {formData.year}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Configuration Data (JSON) *
                </label>
                <textarea
                  value={formData.config_data}
                  onChange={(e) => setFormData({ ...formData, config_data: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-mono text-sm"
                  rows="10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  rows="3"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600"
                >
                  Update Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Benefits Calculator Preview</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Benefit Type
                </label>
                <select
                  value={previewData.benefit_type}
                  onChange={(e) => setPreviewData({ ...previewData, benefit_type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                >
                  <option value="all">All Benefits</option>
                  <option value="sss">SSS</option>
                  <option value="philhealth">PhilHealth</option>
                  <option value="pagibig">Pag-IBIG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Monthly Salary
                </label>
                <input
                  type="number"
                  value={previewData.monthly_salary}
                  onChange={(e) =>
                    setPreviewData({ ...previewData, monthly_salary: Number.parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                />
              </div>
              <button
                onClick={handlePreview}
                className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Calculate
              </button>

              {previewResult && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Results:</h3>
                  <pre className="text-sm text-slate-600 dark:text-slate-300 overflow-x-auto">
                    {JSON.stringify(previewResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => {
                  setShowPreviewModal(false)
                  setPreviewResult(null)
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
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

export default BenefitsConfig
