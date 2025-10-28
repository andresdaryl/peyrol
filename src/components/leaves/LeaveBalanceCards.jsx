import { Briefcase } from "lucide-react"

const LeaveBalanceCards = ({ leaveBalance }) => {
  if (!leaveBalance) return null

  return (
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
  )
}

export default LeaveBalanceCards
