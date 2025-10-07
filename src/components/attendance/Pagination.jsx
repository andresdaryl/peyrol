"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({ page, setPage, totalPages, limit, total }) => {
  if (totalPages <= 1) return null

  return (
    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
