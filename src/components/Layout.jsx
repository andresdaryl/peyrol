"use client";

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
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
  CirclePercent,
  BadgePlus,
  ChevronDown,
} from "lucide-react";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleConfigDropDown = () => {
    setConfigOpen(!configOpen);
    setSettingsOpen(false);
    setUserMenuOpen(false);
  };

  const handleSettingsDropDown = () => {
    setSettingsOpen(!settingsOpen);
    setConfigOpen(false);
    setUserMenuOpen(false);
  };

  const handleUserMenuDropDown = () => {
    setUserMenuOpen(!userMenuOpen);
    setConfigOpen(false);
    setSettingsOpen(false);
  };

  const mainNavItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/employees", icon: Users, label: "Employees" },
    { path: "/attendance", icon: Clock, label: "Attendance" },
    { path: "/leaves", icon: Briefcase, label: "Leaves" },
    { path: "/payroll", icon: CreditCard, label: "Payroll" },
    { path: "/payslips", icon: FileText, label: "Payslips" },
  ];

  const configNavItems = [
    ...(user?.role === "admin" || user?.role === "superadmin"
      ? [
          { path: "/holidays", icon: Calendar, label: "Holidays" },
          { path: "/benefits-config", icon: BadgePlus, label: "Benefits" },
          { path: "/tax-config", icon: CirclePercent, label: "Taxes" },
        ]
      : []),
  ];

  const adminNavItems = [
    ...(user?.role === "superadmin"
      ? [{ path: "/users", icon: Users, label: "Users" }]
      : []),
  ];

  const settingsNavItems = [
    { path: "/company-profile", icon: Building2, label: "Company" },
    { path: "/account-settings", icon: User, label: "Account" },
  ];

  const isActive = (path) => location.pathname === path;

  const onNavLinkClick = (path) => {
    setSidebarOpen(false);

    if (mainNavItems.some((item) => item.path === path)) {
      setSettingsOpen(false);
      setConfigOpen(false);
      setUserMenuOpen(false);
    }
  };

  const NavLink = ({ item }) => (
    <Link
      to={item.path}
      onClick={() => onNavLinkClick(item.path)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
        isActive(item.path)
          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
          : "text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-800"
      }`}
      data-testid={`nav-${item.label.toLowerCase()}`}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Paymora logo"
              className="w-8 h-8 object-cover rounded-xl shadow-md"
            />
            <span className="font-bold text-lg text-slate-800 dark:text-white">
              Paymora
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-slate-700 dark:text-white"
            data-testid="mobile-menu-toggle"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Paymora logo"
                className="w-10 h-10 object-cover rounded-xl shadow-md"
              />
              <div>
                <h1 className="font-bold text-xl text-slate-800 dark:text-white">
                  Paymora
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Payroll Management
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mainNavItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>

          {/* Bottom Section: Config, Settings, User Menu */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            {/* Configuration Dropdown */}
            {configNavItems?.length > 0 && (
              <div className="mb-2">
                <button
                  onClick={handleConfigDropDown}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 active:scale-100 dark:text-slate-400 uppercase hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  data-testid="config-dropdown-toggle"
                >
                  <span>Configuration</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      configOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`space-y-1 mt-1 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    configOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  {configNavItems.map((item) => (
                    <NavLink key={item.path} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Settings Dropdown */}
            <div className="mb-2">
              <button
                onClick={handleSettingsDropDown}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 active:scale-100 dark:text-slate-400 uppercase hover:text-slate-700 dark:hover:text-slate-300 transition-colors "
                data-testid="settings-dropdown-toggle"
              >
                <span>Settings</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    settingsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`space-y-1 mt-1 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                  settingsOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                {settingsNavItems.map((item) => (
                  <NavLink key={item.path} item={item} />
                ))}
                {adminNavItems.map((item) => (
                  <NavLink key={item.path} item={item} />
                ))}
              </div>
            </div>

            {/* User Menu Dropdown */}
            <div className="relative">
              {/* Dropdown Menu Panel (appears above the button) */}
              <div
                className={`absolute bottom-full left-0 right-0 mb-2 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out transform ${
                  userMenuOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 translate-y-2 invisible"
                }`}
                data-testid="user-menu"
              >
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    data-testid="theme-toggle"
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    data-testid="logout-button"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Dropdown Toggle Button */}
              <button
                onClick={handleUserMenuDropDown}
                className="w-full text-left bg-amber-100/50 dark:bg-slate-800/50 rounded-xl p-4 hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors flex justify-between items-center active:scale-100"
                data-testid="user-menu-toggle"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1 capitalize">
                    {user?.role?.replace("superadmin", "Super Admin")}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onNavLinkClick}
        />
      )}
    </div>
  );
};

export default Layout;
