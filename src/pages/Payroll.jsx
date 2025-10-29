"use client";

import { useState, useEffect } from "react";
import { Plus, AudioLines as PhilippinePeso } from "lucide-react";
import {
  payrollRunAPI,
  payrollEntryAPI,
  payslipAPI,
  reportsAPI,
  employeeAPI,
} from "../utils/api";
import { toast } from "sonner";
import PayrollRunsList from "../components/payroll/PayrollRunsList";
import PayrollSummaryCard from "../components/payroll/PayrollSummaryCard";
import PayrollActions from "../components/payroll/PayrollActions";
import PayrollEntriesTable from "../components/payroll/PayrollEntriesTable";
import TableSkeleton from "../components/payroll/TableSkeleton";
import CreateRunModal from "../components/payroll/CreateRunModal";
import EditEntryModal from "../components/payroll/EditEntryModal";
import PayrollSkeleton from "@/components/payroll/PayrollSkeleton";

const Payroll = () => {
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [entries, setEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    type: "weekly",
  });

  const [runsFilters, setRunsFilters] = useState({
    start_date: "",
    end_date: "",
    type: "",
  });

  const [entriesFilters, setEntriesFilters] = useState({
    employee_id: "",
    version: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchRuns();
  }, [runsFilters]);

  useEffect(() => {
    if (selectedRun) {
      fetchRunDetails(selectedRun.id);
    }
  }, [entriesFilters]);

  const fetchRuns = async () => {
    try {
      setLoading(true);
      const params = {};
      if (runsFilters.start_date) params.start_date = runsFilters.start_date;
      if (runsFilters.end_date) params.end_date = runsFilters.end_date;
      if (runsFilters.type) params.type = runsFilters.type;

      const response = await payrollRunAPI.getAll(params);
      setRuns(response.data);
    } catch (error) {
      toast.error("Failed to fetch payroll runs");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response?.data?.data);
    } catch (error) {
      console.error("Failed to fetch employees");
    }
  };

  const fetchRunDetails = async (runId) => {
    try {
      setLoadingEntries(true);
      const params = { run_id: runId };
      if (entriesFilters.employee_id)
        params.employee_id = entriesFilters.employee_id;
      if (entriesFilters.version)
        params.version = Number.parseInt(entriesFilters.version);

      const [entriesRes, summaryRes] = await Promise.all([
        payrollEntryAPI.getAll(params),
        reportsAPI.getPayrollSummary(runId),
      ]);
      setEntries(entriesRes.data);
      setSummary(summaryRes.data.summary);
    } catch (error) {
      toast.error("Failed to fetch run details");
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleCreateRun = async (e) => {
    e.preventDefault();
    try {
      await payrollRunAPI.create(formData);
      toast.success("Payroll run created");
      fetchRuns();
      setShowCreateModal(false);
      setFormData({ start_date: "", end_date: "", type: "weekly" });
    } catch (error) {
      toast.error("Failed to create run");
    }
  };

  const handleGenerateEntries = async (runId) => {
    try {
      await payrollRunAPI.generateEntries(runId);
      toast.success("Payroll entries generated");
      fetchRunDetails(runId);
    } catch (error) {
      toast.error("Failed to generate entries");
    }
  };

  const handleFinalizeRun = async (runId) => {
    if (
      window.confirm("Finalize this payroll run? This will lock all entries.")
    ) {
      try {
        await payrollRunAPI.update(runId, { status: "finalized" });
        toast.success("Payroll run finalized");
        fetchRuns();
      } catch (error) {
        toast.error("Failed to finalize");
      }
    }
  };

  const handleGeneratePayslips = async (runId) => {
    try {
      const runEntries = await payrollEntryAPI.getAll({ run_id: runId });
      for (const entry of runEntries.data) {
        await payslipAPI.generate(entry.id);
      }
      toast.success("All payslips generated");
    } catch (error) {
      toast.error("Failed to generate payslips");
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  const handleUpdateEntry = async (e) => {
    e.preventDefault();
    try {
      await payrollEntryAPI.update(editingEntry.id, editingEntry);
      toast.success("Entry updated");
      fetchRunDetails(selectedRun.id);
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleSelectRun = (run) => {
    setSelectedRun(run);
    setEntriesFilters({ employee_id: "", version: "" });
    fetchRunDetails(run.id);
  };

  const handleRunsFilterChange = (filters) => {
    setRunsFilters(filters);
  };

  const handleEntriesFilterChange = (filters) => {
    setEntriesFilters(filters);
  };

  if (loading) {
    return <PayrollSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-4xl font-bold text-slate-800 dark:text-white"
            data-testid="payroll-title"
          >
            Payroll
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create and manage payroll runs
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          data-testid="create-payroll-run"
        >
          <Plus className="w-5 h-5" />
          <span>Create Payroll Run</span>
        </button>
      </div>

      {/* Payroll Runs List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PayrollRunsList
            runs={runs}
            selectedRun={selectedRun}
            onSelectRun={handleSelectRun}
            onFilterChange={handleRunsFilterChange}
          />
        </div>

        {/* Run Details */}
        <div className="lg:col-span-2">
          {selectedRun ? (
            <div className="space-y-6">
              <PayrollSummaryCard summary={summary} />

              <PayrollActions
                selectedRun={selectedRun}
                onGenerateEntries={handleGenerateEntries}
                onGeneratePayslips={handleGeneratePayslips}
                onFinalizeRun={handleFinalizeRun}
              />

              {loadingEntries ? (
                <TableSkeleton />
              ) : (
                <PayrollEntriesTable
                  entries={entries}
                  selectedRun={selectedRun}
                  onEditEntry={handleEditEntry}
                  employees={employees}
                  onFilterChange={handleEntriesFilterChange}
                />
              )}
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
              <PhilippinePeso className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                Select a payroll run to view details
              </p>
            </div>
          )}
        </div>
      </div>

      <CreateRunModal
        show={showCreateModal}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleCreateRun}
        onClose={() => setShowCreateModal(false)}
      />

      <EditEntryModal
        show={showEditModal}
        entry={editingEntry}
        onEntryChange={setEditingEntry}
        onSubmit={handleUpdateEntry}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};

export default Payroll;
