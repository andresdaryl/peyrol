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
  getSummary: (employeeId, startDate, endDate) =>
    axios.get(`${API_URL}/attendance/employee/${employeeId}/summary`, {
      params: { start_date: startDate, end_date: endDate },
      headers: getAuthHeaders(),
    }),
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

// Leaves API
export const leaveAPI = {
  request: (data) => axios.post(`${API_URL}/leaves`, data, { headers: getAuthHeaders() }),
  getAll: (params) => axios.get(`${API_URL}/leaves`, { params, headers: getAuthHeaders() }),
  update: (id, data) => axios.put(`${API_URL}/leaves/${id}`, data, { headers: getAuthHeaders() }),
  getBalance: (employeeId) => axios.get(`${API_URL}/leaves/balance/${employeeId}`, { headers: getAuthHeaders() }),
  initializeBalance: (employeeId) => 
    axios.post(`${API_URL}/leaves/initialize-balance/${employeeId}`, {}, { headers: getAuthHeaders() }),
  assignCredits: (employeeId, sickLeave, vacationLeave, reason) =>
    axios.post(`${API_URL}/leaves/assign-credits`, {
      employee_id: employeeId,
      sick_leave: sickLeave,
      vacation_leave: vacationLeave,
      reason: reason
    }, { headers: getAuthHeaders() }),
  bulkInitialize: () =>
    axios.post(`${API_URL}/leaves/bulk-initialize`, {}, { headers: getAuthHeaders() }),
  annualReset: (year) =>
    axios.post(`${API_URL}/leaves/annual-reset`, { year }, { headers: getAuthHeaders() }),
  getBalanceSummary: () =>
    axios.get(`${API_URL}/leaves/balance-summary`, { headers: getAuthHeaders() }),  
}

// Holidays API
export const holidayAPI = {
  create: (data) => axios.post(`${API_URL}/holidays`, data, { headers: getAuthHeaders() }),
  getAll: (params) => axios.get(`${API_URL}/holidays`, { params, headers: getAuthHeaders() }),
  update: (id, data) => axios.put(`${API_URL}/holidays/${id}`, data, { headers: getAuthHeaders() }),
  delete: (id) => axios.delete(`${API_URL}/holidays/${id}`, { headers: getAuthHeaders() }),
  bulkCreate: (data) => axios.post(`${API_URL}/holidays/bulk-create`, data, { headers: getAuthHeaders() }),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => axios.get(`${API_URL}/dashboard/stats`, { headers: getAuthHeaders() }),
  getAttendanceTrends: (days = 30) =>
    axios.get(`${API_URL}/dashboard/attendance-trends`, {
      params: { days },
      headers: getAuthHeaders(),
    }),
  getAttendanceBreakdown: () => axios.get(`${API_URL}/dashboard/attendance-breakdown`, { headers: getAuthHeaders() }),
  getPayrollTrends: (months = 6) =>
    axios.get(`${API_URL}/dashboard/payroll-trends`, {
      params: { months },
      headers: getAuthHeaders(),
    }),
  getEmployeesByDepartment: () =>
    axios.get(`${API_URL}/dashboard/employees-by-department`, { headers: getAuthHeaders() }),
  getPayrollByDepartment: () => axios.get(`${API_URL}/dashboard/payroll-by-department`, { headers: getAuthHeaders() }),
  getDepartmentAttendanceRates: (days = 30) =>
    axios.get(`${API_URL}/dashboard/department-attendance-rates`, {
      params: { days },
      headers: getAuthHeaders(),
    }),
  getRecentActivity: (limit = 5) =>
    axios.get(`${API_URL}/dashboard/recent-activity`, {
      params: { limit },
      headers: getAuthHeaders(),
    }),
  getAttendanceDeductions: (startDate, endDate) =>
    axios.get(`${API_URL}/dashboard/attendance-deductions`, {
      params: { start_date: startDate, end_date: endDate },
      headers: getAuthHeaders(),
    }),
  getLeaveStatistics: () => axios.get(`${API_URL}/dashboard/leave-statistics`, { headers: getAuthHeaders() }),
  getHolidayCalendar: (year) =>
    axios.get(`${API_URL}/dashboard/holiday-calendar`, {
      params: { year },
      headers: getAuthHeaders(),
    }),
}

// Auth API
export const authAPI = {
  deleteAccount: () => axios.delete(`${API_URL}/account/delete-account`, { headers: getAuthHeaders() }),
}

// Employee Image API
export const employeeImageAPI = {
  uploadImage: (id, file) => {
    const formData = new FormData()
    formData.append("file", file)
    return axios.post(`${API_URL}/employees/${id}/upload-image`, formData, { headers: getAuthHeaders() })
  },
  deleteImage: (id) => axios.delete(`${API_URL}/employees/${id}/image`, { headers: getAuthHeaders() }),
  initializeLeaves: (id) => axios.post(`${API_URL}/employees/${id}/initialize-leaves`, {}, { headers: getAuthHeaders() }),
}

// Attendance Import API
export const attendanceImportAPI = {
  importFile: (file) => {
    const formData = new FormData()
    formData.append("file", file)
    return axios.post(`${API_URL}/attendance/import`, formData, { headers: getAuthHeaders() })
  },
  downloadTemplate: () => axios.get(`${API_URL}/attendance/import/template`, {
    headers: getAuthHeaders(),
    responseType: "blob",
  }),
}

// Company API
export const companyAPI = {
  getProfile: () => axios.get(`${API_URL}/company/profile`, { headers: getAuthHeaders() }),
  updateProfile: (data) => axios.put(`${API_URL}/company/profile`, data, { headers: getAuthHeaders() }),
  uploadLogo: (file) => {
    const formData = new FormData()
    formData.append("file", file)
    return axios.post(`${API_URL}/company/logo`, formData, { headers: getAuthHeaders() })
  },
  deleteLogo: () => axios.delete(`${API_URL}/company/logo`, { headers: getAuthHeaders() }),
}
