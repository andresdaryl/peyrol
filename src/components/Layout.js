"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import {
  LayoutDashboard,
  Users,
  Clock,
  CreditCard,
  FileText,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  User,
  Calendar,
  Briefcase,
  Building2,
} from "lucide-react"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const mainNavItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/employees", icon: Users, label: "Employees" },
    { path: "/attendance", icon: Clock, label: "Attendance" },
    { path: "/leaves", icon: Briefcase, label: "Leaves" },
    { path: "/holidays", icon: Calendar, label: "Holidays" },
    { path: "/payroll", icon: CreditCard, label: "Payroll" },
    { path: "/payslips", icon: FileText, label: "Payslips" },
  ]

  const userNavItems = [
    { path: "/company-profile", icon: Building2, label: "Company Profile" },
    { path: "/account-settings", icon: User, label: "Account Settings" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-amber-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Peyrol logo" className="w-8 h-8 object-cover rounded-xl shadow-md" />
            <span className="font-bold text-lg text-slate-800 dark:text-white">Peyrol</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-slate-700 dark:text-white"
            data-testid="mobile-menu-toggle"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-amber-200 dark:border-slate-700`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-amber-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Peyrol logo" className="w-10 h-10 object-cover rounded-xl shadow-md" />
              <div>
                <h1 className="font-bold text-xl text-slate-800 dark:text-white">Peyrol</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Payroll Management App</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive(item.path) ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg" : "text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-800"}`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="pt-2 mt-2 border-t border-amber-200 dark:border-slate-700">
              {userNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive(item.path) ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg" : "text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-800"}`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-amber-200 dark:border-slate-700">
            <div className="bg-amber-100/50 dark:bg-slate-800/50 rounded-xl p-4 mb-3">
              <p className="text-sm font-medium text-slate-800 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{user?.email}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                {user?.role === "superadmin" ? "Super Admin" : "Admin"}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                data-testid="theme-toggle"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export default Layout
