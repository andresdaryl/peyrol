"use client"
import { AudioLines as PhilippinePeso, FileText, CheckCircle } from "lucide-react"

const PayrollActions = ({ selectedRun, onGenerateEntries, onGeneratePayslips, onFinalizeRun }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onGenerateEntries(selectedRun.id)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedRun.status !== "draft"}
        data-testid="generate-entries"
      >
        <PhilippinePeso className="w-4 h-4" />
        <span>Generate Entries</span>
      </button>
      <button
        onClick={() => onGeneratePayslips(selectedRun.id)}
        className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        data-testid="generate-payslips"
      >
        <FileText className="w-4 h-4" />
        <span>Generate Payslips</span>
      </button>
      <button
        onClick={() => onFinalizeRun(selectedRun.id)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedRun.status !== "draft"}
        data-testid="finalize-run"
      >
        <CheckCircle className="w-4 h-4" />
        <span>Finalize</span>
      </button>
    </div>
  )
}

export default PayrollActions
