import axios from "axios"

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Employee API
export const employeeAPI = {
  getAll: (params) => axios.get(`${API_URL}/employees?${params || ""}`, { headers: getAuthHeaders() }),
  getById: (id) => axios.get(`${API_URL}/employees/${id}`, { headers: getAuthHeaders() }),
  create: (data) => axios.post(`${API_URL}/employees`, data, { headers: getAuthHeaders() }),
  update: (id, data) => axios.put(`${API_URL}/employees/${id}`, data, { headers: getAuthHeaders() }),
  delete: (id) => axios.delete(`${API_URL}/employees/${id}`, { headers: getAuthHeaders() }),
}

// Attendance API
export const attendanceAPI = {
  getAll: (params) => axios.get(`${API_URL}/attendance?${params || ""}`, { headers: getAuthHeaders() }),
  getById: (id) => axios.get(`${API_URL}/attendance/${id}`, { headers: getAuthHeaders() }),
  create: (data) => axios.post(`${API_URL}/attendance`, data, { headers: getAuthHeaders() }),
  update: (id, data) => axios.put(`${API_URL}/attendance/${id}`, data, { headers: getAuthHeaders() }),
  delete: (id) => axios.delete(`${API_URL}/attendance/${id}`, { headers: getAuthHeaders() }),
}

// Payroll Run API
export const payrollRunAPI = {
  getAll: () => axios.get(`${API_URL}/payroll/runs`, { headers: getAuthHeaders() }),
  getById: (id) => axios.get(`${API_URL}/payroll/runs/${id}`, { headers: getAuthHeaders() }),
  create: (data) => axios.post(`${API_URL}/payroll/runs`, data, { headers: getAuthHeaders() }),
  update: (id, data) => axios.put(`${API_URL}/payroll/runs/${id}`, data, { headers: getAuthHeaders() }),
  generateEntries: (id) => axios.post(`${API_URL}/payroll/entries/${id}/generate`, {}, { headers: getAuthHeaders() }),
}

// Payroll Entry API
export const payrollEntryAPI = {
  getAll: (params) => axios.get(`${API_URL}/payroll/entries`, { params, headers: getAuthHeaders() }),
  getById: (id) => axios.get(`${API_URL}/payroll/entries/${id}`, { headers: getAuthHeaders() }),
  update: (id, data) => axios.put(`${API_URL}/payroll/entries/${id}`, data, { headers: getAuthHeaders() }),
  getContributions: (id) => axios.get(`${API_URL}/payroll/entries/${id}/contributions`, { headers: getAuthHeaders() }),
}

// Payslip API
export const payslipAPI = {
  getAll: (params) => axios.get(`${API_URL}/payslips`, { params, headers: getAuthHeaders() }),
  getById: (id) => axios.get(`${API_URL}/payslips/${id}`, { headers: getAuthHeaders() }),
  generate: (entryId) => axios.post(`${API_URL}/payslips/${entryId}/generate`, {}, { headers: getAuthHeaders() }),
  download: (id) =>
    axios.get(`${API_URL}/payslips/${id}/download`, {
      headers: getAuthHeaders(),
      responseType: "blob",
    }),
}

// Reports API
export const reportsAPI = {
  getPayrollSummary: (runId) => axios.get(`${API_URL}/reports/payroll-summary/${runId}`, { headers: getAuthHeaders() }),
  getEmployeeHistory: (employeeId) =>
    axios.get(`${API_URL}/reports/employee-history/${employeeId}`, { headers: getAuthHeaders() }),
  getContributionsRemittance: (runId) =>
    axios.get(`${API_URL}/reports/contributions-remittance/${runId}`, { headers: getAuthHeaders() }),
}

// Account API
export const accountAPI = {
  getMe: () => axios.get(`${API_URL}/account/me`, { headers: getAuthHeaders() }),
  updateProfile: (data) => axios.put(`${API_URL}/account/update-profile`, data, { headers: getAuthHeaders() }),
  changePassword: (data) => axios.put(`${API_URL}/account/change-password`, data, { headers: getAuthHeaders() }),
}

// Dashboard API - NOW USING REAL BACKEND ENDPOINTS
export const dashboardAPI = {
  // Get overall dashboard statistics
  getStats: () => axios.get(`${API_URL}/dashboard/stats`, { headers: getAuthHeaders() }),

  // Get attendance trends for the last N days
  getAttendanceTrends: (days = 30) =>
    axios.get(`${API_URL}/dashboard/attendance-trends`, {
      params: { days },
      headers: getAuthHeaders(),
    }),

  // Get today's attendance breakdown
  getAttendanceBreakdown: () => axios.get(`${API_URL}/dashboard/attendance-breakdown`, { headers: getAuthHeaders() }),

  // Get payroll trends for the last N months
  getPayrollTrends: (months = 6) =>
    axios.get(`${API_URL}/dashboard/payroll-trends`, {
      params: { months },
      headers: getAuthHeaders(),
    }),

  // Get employee count by department
  getEmployeesByDepartment: () =>
    axios.get(`${API_URL}/dashboard/employees-by-department`, { headers: getAuthHeaders() }),

  // Get payroll amount by department
  getPayrollByDepartment: () => axios.get(`${API_URL}/dashboard/payroll-by-department`, { headers: getAuthHeaders() }),

  // Get attendance rates by department
  getDepartmentAttendanceRates: (days = 30) =>
    axios.get(`${API_URL}/dashboard/department-attendance-rates`, {
      params: { days },
      headers: getAuthHeaders(),
    }),

  // Get recent activity (attendance, payrolls, employees)
  getRecentActivity: (limit = 5) =>
    axios.get(`${API_URL}/dashboard/recent-activity`, {
      params: { limit },
      headers: getAuthHeaders(),
    }),
}