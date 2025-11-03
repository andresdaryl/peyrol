import { PhilippinePeso, FileText, CheckCircle } from "lucide-react";

const PayrollActions = ({
  selectedRun,
  onGenerateEntries,
  onGeneratePayslips,
  onGenerateSelectedPayslips,
  onFinalizeRun,
  selectedCount,
  isGenerating,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onGenerateEntries(selectedRun.id)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedRun.status !== "draft"}
        >
          <PhilippinePeso className="w-4 h-4" />
          <span>Generate Entries</span>
        </button>

        <button
          onClick={() => onGeneratePayslips(selectedRun.id)}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isGenerating}
        >
          <FileText className="w-4 h-4" />
          <span>
            {isGenerating ? "Generating..." : "Generate All Payslips"}
          </span>
        </button>

        <button
          onClick={() => onFinalizeRun(selectedRun.id)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedRun.status !== "draft"}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Finalize</span>
        </button>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <span className="text-sm text-amber-800 dark:text-amber-200">
            {selectedCount} {selectedCount === 1 ? "entry" : "entries"} selected
          </span>
          <button
            onClick={onGenerateSelectedPayslips}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={isGenerating}
          >
            <FileText className="w-4 h-4" />
            <span>
              {isGenerating
                ? "Generating..."
                : `Generate ${selectedCount} Payslip${
                    selectedCount > 1 ? "s" : ""
                  }`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PayrollActions;
