import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/utils/api";

// Query keys factory
export const dashboardKeys = {
  all: ["dashboard"],
  stats: () => [...dashboardKeys.all, "stats"],
  attendanceTrends: (days) => [...dashboardKeys.all, "attendance-trends", days],
  attendanceBreakdown: () => [...dashboardKeys.all, "attendance-breakdown"],
  payrollTrends: (months) => [...dashboardKeys.all, "payroll-trends", months],
  employeesByDept: () => [...dashboardKeys.all, "employees-by-department"],
  payrollByDept: () => [...dashboardKeys.all, "payroll-by-department"],
  recentActivity: (limit) => [...dashboardKeys.all, "recent-activity", limit],
  attendanceDeductions: (startDate, endDate) => [
    ...dashboardKeys.all,
    "attendance-deductions",
    startDate,
    endDate,
  ],
  leaveStatistics: () => [...dashboardKeys.all, "leave-statistics"],
  holidayCalendar: (year) => [...dashboardKeys.all, "holiday-calendar", year],
};

// Individual query hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response = await dashboardAPI.getStats();
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch stats:", error);
    },
  });
};

export const useAttendanceTrends = (days = 30) => {
  return useQuery({
    queryKey: dashboardKeys.attendanceTrends(days),
    queryFn: async () => {
      const response = await dashboardAPI.getAttendanceTrends(days);
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch attendanceTrends:", error);
    },
  });
};

export const useAttendanceBreakdown = () => {
  return useQuery({
    queryKey: dashboardKeys.attendanceBreakdown(),
    queryFn: async () => {
      const response = await dashboardAPI.getAttendanceBreakdown();
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch attendanceBreakdown:", error);
    },
  });
};

export const usePayrollTrends = (months = 6) => {
  return useQuery({
    queryKey: dashboardKeys.payrollTrends(months),
    queryFn: async () => {
      const response = await dashboardAPI.getPayrollTrends(months);
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch payrollTrends:", error);
    },
  });
};

export const useEmployeesByDepartment = () => {
  return useQuery({
    queryKey: dashboardKeys.employeesByDept(),
    queryFn: async () => {
      const response = await dashboardAPI.getEmployeesByDepartment();
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch employeesByDept:", error);
    },
  });
};

export const usePayrollByDepartment = () => {
  return useQuery({
    queryKey: dashboardKeys.payrollByDept(),
    queryFn: async () => {
      const response = await dashboardAPI.getPayrollByDepartment();
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch payrollByDept:", error);
    },
  });
};

export const useRecentActivity = (limit = 5) => {
  return useQuery({
    queryKey: dashboardKeys.recentActivity(limit),
    queryFn: async () => {
      const response = await dashboardAPI.getRecentActivity(limit);
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch getRecentActivity:", error);
    },
  });
};

export const useAttendanceDeductions = (startDate, endDate) => {
  return useQuery({
    queryKey: dashboardKeys.attendanceDeductions(startDate, endDate),
    queryFn: async () => {
      const response = await dashboardAPI.getAttendanceDeductions(
        startDate,
        endDate
      );
      return response.data;
    },
    enabled: !!startDate && !!endDate, // Only fetch when dates are available
    onError: (error) => {
      console.error("Failed to fetch attendanceDeductions:", error);
    },
  });
};

export const useLeaveStatistics = () => {
  return useQuery({
    queryKey: dashboardKeys.leaveStatistics(),
    queryFn: async () => {
      const response = await dashboardAPI.getLeaveStatistics();
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to fetch leaveStatistics:", error);
    },
  });
};

export const useHolidayCalendar = (year) => {
  return useQuery({
    queryKey: dashboardKeys.holidayCalendar(year),
    queryFn: async () => {
      const response = await dashboardAPI.getHolidayCalendar(year);
      return response.data;
    },
    enabled: !!year, // Only fetch when year is available
    onError: (error) => {
      console.error("Failed to fetch holidayCalendar:", error);
    },
  });
};
