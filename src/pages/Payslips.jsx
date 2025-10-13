import React, { useState, useEffect } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { payslipAPI, employeeAPI, payrollRunAPI } from "../utils/api";
import { toast } from "sonner";

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedRun, setSelectedRun] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [selectedEmployee, selectedRun]);

  const fetchData = async () => {
    try {
      const [employeesRes, runsRes] = await Promise.all([
        employeeAPI.getAll(),
        payrollRunAPI.getAll(),
      ]);
      setEmployees(employeesRes?.data?.data);
      setRuns(runsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayslips = async () => {
    try {
      const params = {};
      if (selectedEmployee) params.employee_id = selectedEmployee;
      if (selectedRun) params.run_id = selectedRun;

      const response = await payslipAPI.getAll(params);
      setPayslips(response?.data?.data);
    } catch (error) {
      toast.error("Failed to fetch payslips");
    }
  };

  const handleDownload = async (payslipId) => {
    try {
      const response = await payslipAPI.download(payslipId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payslip_${payslipId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Payslip downloaded");
    } catch {
      toast.error("Failed to download payslip");
    }
  };

  const handleView = async (payslipId) => {
    try {
      const response = await payslipAPI.download(payslipId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      toast.error("Failed to view payslip");
    }
  };

  const getEmployeeName = (id) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? emp.name : "Unknown";
  };

  const getEmployeeRole = (id) => {
    const emp = employees.find((e) => e.id === id);
    return emp?.role || "—";
  };

  const getEmployeeDepartment = (id) => {
    const emp = employees.find((e) => e.id === id);
    return emp?.department || "—";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
          Payslips
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View and download employee payslips
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filter by Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filter by Payroll Run
            </label>
            <select
              value={selectedRun}
              onChange={(e) => setSelectedRun(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white"
            >
              <option value="">All Runs</option>
              {runs.map((run) => (
                <option key={run.id} value={run.id}>
                  {run.type} ({run.start_date} to {run.end_date})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payslips Grid */}
      {loading ? (
        <PayslipSkeletonLoader />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payslips.length === 0 ? (
          <div className="col-span-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
            <FileText className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              No payslips found
            </p>
          </div>
        ) : (
          payslips.map((payslip) => (
            <div
              key={payslip.id}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-700"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">
                    {getEmployeeName(payslip.employee.id)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getEmployeeRole(payslip.employee.id)} ·{" "}
                    {getEmployeeDepartment(payslip.employee.id)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {payslip.payroll_run.type} (
                    {new Date(
                      payslip.payroll_run.start_date
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      payslip.payroll_run.end_date
                    ).toLocaleDateString()}
                    )
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Gross Pay:
                  </span>
                  <span className="text-slate-800 dark:text-white font-medium">
                    ₱{payslip.payroll_entry.gross.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Net Pay:
                  </span>
                  <span className="text-slate-800 dark:text-white font-semibold">
                    ₱{payslip.payroll_entry.net.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Created:
                  </span>
                  <span className="text-slate-800 dark:text-white">
                    {new Date(payslip.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      payslip.is_editable
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {payslip.is_editable ? "Editable" : "Finalized"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(payslip.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleDownload(payslip.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>        
      )}
    </div>
  );
};

/* Skeleton Loader Component */
const PayslipSkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse p-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-300 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded" />
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-600 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="flex space-x-2 pt-2">
            <div className="flex-1 h-8 bg-slate-300 dark:bg-slate-700 rounded-lg" />
            <div className="flex-1 h-8 bg-slate-300 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Payslips;
