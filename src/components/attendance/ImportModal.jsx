"use client"

import { useState } from "react"
import { Upload, Download, X, CheckCircle, AlertCircle } from "lucide-react"

const ImportModal = ({ showModal, setShowModal, onImportSuccess }) => {
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ]

      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
        alert("Please select a valid Excel (.xlsx, .xls) or CSV file")
        return
      }

      setFile(selectedFile)
      setImportResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      alert("Please select a file first")
      return
    }

    setImporting(true)
    try {
      const { attendanceImportAPI } = await import("../../utils/api")
      const result = await attendanceImportAPI.importFile(file)

      setImportResult(result?.data)

      if (result.imported_count > 0) {
        onImportSuccess?.()
      }
    } catch (error) {
      setImportResult({
        message: error.message || "Import failed",
        imported_count: 0,
        error_count: 1,
        errors: [{ row: 0, error: error.message }],
      })
    } finally {
      setImporting(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const { attendanceImportAPI } = await import("../../utils/api")
      await attendanceImportAPI.downloadTemplate()
    } catch (error) {
      alert("Failed to download template: " + error.message)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setFile(null)
    setImportResult(null)
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Import Attendance</h2>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Download Template Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Step 1: Download Template</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Download the Excel template with the correct format and fill in your attendance data.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Upload File Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Step 2: Upload Filled Template</h3>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer text-amber-600 hover:text-amber-700 font-medium">
                Click to upload
              </label>
              <span className="text-slate-600 dark:text-slate-400"> or drag and drop</span>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Excel (.xlsx, .xls) or CSV files only</p>
              {file && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Import Results */}
          {importResult && (
            <div
              className={`rounded-lg p-4 ${
                importResult.imported_count > 0
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-start space-x-3">
                {importResult.imported_count > 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-2 ${
                      importResult.imported_count > 0
                        ? "text-green-900 dark:text-green-100"
                        : "text-red-900 dark:text-red-100"
                    }`}
                  >
                    {importResult.message}
                  </h4>
                  <div className="text-sm space-y-1">
                    <p className="text-green-700 dark:text-green-300">
                      ✓ Successfully imported: {importResult.imported_count} records
                    </p>
                    {importResult.error_count > 0 && (
                      <p className="text-red-700 dark:text-red-300">✗ Errors: {importResult.error_count}</p>
                    )}
                  </div>

                  {/* Error Details */}
                  {importResult.errors && importResult.errors.length > 0 && (
                    <div className="mt-3 max-h-40 overflow-y-auto">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Error Details:</p>
                      <ul className="text-sm space-y-1 text-red-700 dark:text-red-300">
                        {importResult.errors.map((error, idx) => (
                          <li key={idx} className="flex space-x-2">
                            <span className="font-medium">Row {error.row}:</span>
                            <span>{error.error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Success Details */}
                  {importResult.imported && importResult.imported.length > 0 && (
                    <div className="mt-3 max-h-40 overflow-y-auto">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Imported Records:</p>
                      <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                        {importResult.imported.slice(0, 5).map((record, idx) => (
                          <li key={idx}>
                            {record.employee_name} - {record.date}
                          </li>
                        ))}
                        {importResult.imported.length > 5 && (
                          <li className="italic">... and {importResult.imported.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              {importResult ? "Close" : "Cancel"}
            </button>
            {!importResult && (
              <button
                onClick={handleImport}
                disabled={!file || importing}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Format Information */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 text-sm">
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Required Columns:</h4>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                • <strong>employee_id</strong> - Employee ID (must exist in system)
              </li>
              <li>
                • <strong>date</strong> - Date in YYYY-MM-DD format
              </li>
              <li>
                • <strong>time_in</strong> - Time in HH:MM format (e.g., 08:00)
              </li>
              <li>
                • <strong>time_out</strong> - Time out HH:MM format (e.g., 17:00)
              </li>
              <li>
                • <strong>shift_type</strong> - DAY, NIGHT, or MIXED
              </li>
            </ul>
            <h4 className="font-semibold text-slate-800 dark:text-white mt-3 mb-2">Optional Columns:</h4>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                • <strong>overtime_hours</strong> - Number of overtime hours
              </li>
              <li>
                • <strong>nightshift_hours</strong> - Number of night shift hours
              </li>
              <li>
                • <strong>notes</strong> - Additional notes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportModal
