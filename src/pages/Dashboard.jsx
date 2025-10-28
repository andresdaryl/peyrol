"use client"

import { useState, useEffect } from "react"
import { Users, Clock, DollarSign, Activity, PieChartIcon, BarChart3 } from "lucide-react"
import { dashboardAPI } from "@/utils/api"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import StatCard from "@/components/dashboard/StatCard"
import ChartCard from "@/components/dashboard/ChartCard"
import AttendanceDeductionsCard from "@/components/dashboard/AttendanceDeductionsCard"
import LeaveStatisticsCard from "@/components/dashboard/LeaveStatisticsCard"
import HolidayCalendarCard from "@/components/dashboard/HolidayCalendarCard"
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton"

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [attendanceTrends, setAttendanceTrends] = useState(null)
  const [attendanceBreakdown, setAttendanceBreakdown] = useState(null)
  const [payrollTrends, setPayrollTrends] = useState(null)
  const [employeesByDept, setEmployeesByDept] = useState(null)
  const [payrollByDept, setPayrollByDept] = useState(null)
  const [recentActivity, setRecentActivity] = useState(null)
  const [attendanceDeductions, setAttendanceDeductions] = useState(null)
  const [leaveStatistics, setLeaveStatistics] = useState(null)
  const [holidayCalendar, setHolidayCalendar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [attendancePeriod, setAttendancePeriod] = useState(30)
  const [payrollPeriod, setPayrollPeriod] = useState(6)

  useEffect(() => {
    fetchDashboardData()
  }, [attendancePeriod, payrollPeriod])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]
      const currentYear = now.getFullYear()

      const [
        statsRes,
        trendsRes,
        breakdownRes,
        payrollRes,
        empDeptRes,
        payrollDeptRes,
        activityRes,
        deductionsRes,
        leaveRes,
        holidayRes,
      ] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getAttendanceTrends(attendancePeriod),
        dashboardAPI.getAttendanceBreakdown(),
        dashboardAPI.getPayrollTrends(payrollPeriod),
        dashboardAPI.getEmployeesByDepartment(),
        dashboardAPI.getPayrollByDepartment(),
        dashboardAPI.getRecentActivity(5),
        dashboardAPI.getAttendanceDeductions(startDate, endDate),
        dashboardAPI.getLeaveStatistics(),
        dashboardAPI.getHolidayCalendar(currentYear),
      ])

      setStats(statsRes.data)
      setAttendanceTrends(trendsRes.data)
      setAttendanceBreakdown(breakdownRes.data)
      setPayrollTrends(payrollRes.data)
      setEmployeesByDept(empDeptRes.data)
      setPayrollByDept(payrollDeptRes.data)
      setRecentActivity(activityRes.data)
      setAttendanceDeductions(deductionsRes.data)
      setLeaveStatistics(leaveRes.data)
      setHolidayCalendar(holidayRes.data)
    } catch (error) {
      console.error("Failed to fetch dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = {
    primary: "#f59e0b",
    secondary: "#06b6d4",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
    purple: "#a855f7",
    pink: "#ec4899",
  }

  const PIE_COLORS = ["#f59e0b", "#06b6d4", "#10b981", "#ef4444", "#a855f7", "#ec4899"]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  // Prepare chart data
  const attendanceChartData = attendanceTrends?.labels.map((label, i) => ({
    date: label.slice(5),
    Present: attendanceTrends.present[i],
    Absent: attendanceTrends.absent[i],
    Late: attendanceTrends.late[i],
  }))

  const attendancePieData = attendanceBreakdown
    ? [
        { name: "Present", value: attendanceBreakdown.present, color: COLORS.success },
        { name: "Absent", value: attendanceBreakdown.absent, color: COLORS.danger },
        { name: "Late", value: attendanceBreakdown.late, color: COLORS.warning },
        { name: "On Leave", value: attendanceBreakdown.onLeave, color: COLORS.info },
      ]
    : []

  const payrollChartData = payrollTrends?.labels.map((label, i) => ({
    month: label,
    Amount: payrollTrends.amounts[i],
    Employees: payrollTrends.employeeCounts[i],
  }))

  const payrollDeptData = payrollByDept
    ? Object.entries(payrollByDept).map(([dept, amount]) => ({
        department: dept,
        amount,
      }))
    : []

  const employeeDeptData = employeesByDept
    ? Object.entries(employeesByDept).map(([dept, count], i) => ({
        name: dept,
        value: count,
        color: PIE_COLORS[i % PIE_COLORS.length],
      }))
    : []

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.employees.total || 0,
      change: stats?.employees.changeFromLastMonth || 0,
      subtext: `${stats?.employees.active || 0} active`,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Today's Attendance",
      value: `${stats?.attendance.todayRate.toFixed(1)}%`,
      change: stats?.attendance.todayRate - stats?.attendance.yesterdayRate,
      subtext: `${stats?.attendance.todayPresent} present`,
      icon: Clock,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "This Month Payroll",
      value: formatCurrency(stats?.payroll.thisMonthAmount || 0),
      change:
        ((stats?.payroll.thisMonthAmount - stats?.payroll.lastMonthAmount) / stats?.payroll.lastMonthAmount) * 100,
      subtext: "Total cost",
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Average Salary",
      value: formatCurrency(stats?.payroll.averageSalary || 0),
      change: 2.5,
      subtext: "Per employee",
      icon: Activity,
      gradient: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Comprehensive analytics and insights for your payroll system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AttendanceDeductionsCard data={attendanceDeductions} formatCurrency={formatCurrency} />
        <LeaveStatisticsCard data={leaveStatistics} />
        <HolidayCalendarCard data={holidayCalendar} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Attendance Trends"
          icon={BarChart3}
          gradient="from-emerald-500 to-teal-500"
          actions={
            <select
              value={attendancePeriod}
              onChange={(e) => setAttendancePeriod(Number(e.target.value))}
              className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={7}>7 Days</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
            </select>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: "12px" }} />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Present" stroke={COLORS.success} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Absent" stroke={COLORS.danger} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Late" stroke={COLORS.warning} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Today's Attendance" icon={PieChartIcon} gradient="from-blue-500 to-cyan-500">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendancePieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {attendancePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Payroll Trends"
          icon={DollarSign}
          gradient="from-amber-500 to-orange-500"
          actions={
            <select
              value={payrollPeriod}
              onChange={(e) => setPayrollPeriod(Number(e.target.value))}
              className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
            </select>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={payrollChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: "12px" }} />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="Amount" stroke={COLORS.primary} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payroll by Department" icon={BarChart3} gradient="from-purple-500 to-pink-500">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payrollDeptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="department" stroke="#64748b" style={{ fontSize: "12px" }} />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Bar dataKey="amount" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Employees by Department" icon={Users} gradient="from-pink-500 to-rose-500">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employeeDeptData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {employeeDeptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent Activity" icon={Activity} gradient="from-teal-500 to-emerald-500">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Latest Attendance</h3>
              <div className="space-y-2">
                {recentActivity?.recentAttendance.slice(0, 3).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{record.employeeName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{record.checkIn || "N/A"}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === "present"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : record.status === "late"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Recent Payrolls</h3>
              <div className="space-y-2">
                {recentActivity?.recentPayrolls.slice(0, 2).map((payroll) => (
                  <div
                    key={payroll.id}
                    className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{payroll.period}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{payroll.employeeCount} employees</p>
                    </div>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrency(payroll.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

export default Dashboard
