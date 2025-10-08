"use client"

const EditEntryModal = ({ show, entry, onEntryChange, onSubmit, onClose }) => {
  if (!show || !entry) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Entry</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{entry.employee_name}</p>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Base Pay</label>
            <input
              type="number"
              step="0.01"
              value={entry.base_pay}
              onChange={(e) => onEntryChange({ ...entry, base_pay: Number.parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Overtime Pay</label>
            <input
              type="number"
              step="0.01"
              value={entry.overtime_pay}
              onChange={(e) => onEntryChange({ ...entry, overtime_pay: Number.parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEntryModal
