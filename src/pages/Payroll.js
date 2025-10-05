import React, { useState, useEffect } from 'react';
import { Plus, PhilippinePeso, FileText, Eye, Edit2, CheckCircle, Archive } from 'lucide-react';
import { payrollRunAPI, payrollEntryAPI, payslipAPI, reportsAPI } from '../utils/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Payroll = () => {
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    type: 'weekly'
  });

  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    try {
      const response = await payrollRunAPI.getAll();
      setRuns(response.data);
    } catch (error) {
      toast.error('Failed to fetch payroll runs');
    } finally {
      setLoading(false);
    }
  };

  const fetchRunDetails = async (runId) => {
    try {
      const [entriesRes, summaryRes] = await Promise.all([
        payrollEntryAPI.getAll({ run_id: runId }),
        reportsAPI.getPayrollSummary(runId)
      ]);
      setEntries(entriesRes.data);
      setSummary(summaryRes.data.summary);
    } catch (error) {
      toast.error('Failed to fetch run details');
    }
  };

  const handleCreateRun = async (e) => {
    e.preventDefault();
    try {
      await payrollRunAPI.create(formData);
      toast.success('Payroll run created');
      fetchRuns();
      setShowCreateModal(false);
      setFormData({ start_date: '', end_date: '', type: 'weekly' });
    } catch (error) {
      toast.error('Failed to create run');
    }
  };

  const handleGenerateEntries = async (runId) => {
    try {
      await payrollRunAPI.generateEntries(runId);
      toast.success('Payroll entries generated');
      fetchRunDetails(runId);
    } catch (error) {
      toast.error('Failed to generate entries');
    }
  };

  const handleFinalizeRun = async (runId) => {
    if (window.confirm('Finalize this payroll run? This will lock all entries.')) {
      try {
        await payrollRunAPI.update(runId, { status: 'finalized' });
        toast.success('Payroll run finalized');
        fetchRuns();
      } catch (error) {
        toast.error('Failed to finalize');
      }
    }
  };

  const handleGeneratePayslips = async (runId) => {
    try {
      const runEntries = await payrollEntryAPI.getAll({ run_id: runId });
      for (const entry of runEntries.data) {
        await payslipAPI.generate(entry.id);
      }
      toast.success('All payslips generated');
    } catch (error) {
      toast.error('Failed to generate payslips');
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
      toast.success('Entry updated');
      fetchRunDetails(selectedRun.id);
      setShowEditModal(false);
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white" data-testid="payroll-title">
            Payroll Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Create and manage payroll runs</p>
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
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Payroll Runs</h2>
          {runs.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">No runs yet</p>
          ) : (
            runs.map((run) => (
              <div
                key={run.id}
                onClick={() => {
                  setSelectedRun(run);
                  fetchRunDetails(run.id);
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedRun?.id === run.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white/70 dark:bg-slate-800/70 hover:shadow-lg border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold dark:text-gray-200">{run.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    run.status === 'draft' ? 'bg-yellow-200 text-yellow-800' :
                    run.status === 'finalized' ? 'bg-green-200 text-green-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {run.status}
                  </span>
                </div>
                <p className="text-sm opacity-90 dark:text-gray-200">{run.start_date} to {run.end_date}</p>
              </div>
            ))
          )}
        </div>

        {/* Run Details */}
        <div className="lg:col-span-2">
          {selectedRun ? (
            <div className="space-y-6">
              {/* Summary */}
              {summary && (
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Summary</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Gross Pay</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">₱{summary.total_gross?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Deductions</p>
                      <p className="text-2xl font-bold text-red-600">₱{summary.total_deductions?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Net Pay</p>
                      <p className="text-2xl font-bold text-green-600">₱{summary.total_net?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleGenerateEntries(selectedRun.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={selectedRun.status !== 'draft'}
                  data-testid="generate-entries"
                >
                  <PhilippinePeso className="w-4 h-4" />
                  <span>Generate Entries</span>
                </button>
                <button
                  onClick={() => handleGeneratePayslips(selectedRun.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  data-testid="generate-payslips"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Payslips</span>
                </button>
                <button
                  onClick={() => handleFinalizeRun(selectedRun.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={selectedRun.status !== 'draft'}
                  data-testid="finalize-run"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Finalize</span>
                </button>
              </div>

              {/* Entries Table */}
              {entries.length > 0 && (
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm">Employee</th>
                          <th className="px-4 py-3 text-left text-sm">Base Pay</th>
                          <th className="px-4 py-3 text-left text-sm">OT Pay</th>
                          <th className="px-4 py-3 text-left text-sm">Gross</th>
                          <th className="px-4 py-3 text-left text-sm">Net</th>
                          <th className="px-4 py-3 text-left text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {entries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-amber-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 text-slate-800 dark:text-white">{entry.employee_name}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">₱{entry.base_pay?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">₱{entry.overtime_pay?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">₱{entry.gross?.toFixed(2)}</td>
                            <td className="px-4 py-3 font-bold text-green-600">₱{entry.net?.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleEditEntry(entry)}
                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                                disabled={selectedRun.status !== 'draft'}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
              <PhilippinePeso className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Select a payroll run to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Run Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Payroll Run</h2>
            </div>
            <form onSubmit={handleCreateRun} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {showEditModal && editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Entry</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{editingEntry.employee_name}</p>
            </div>
            <form onSubmit={handleUpdateEntry} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Base Pay</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry.base_pay}
                  onChange={(e) => setEditingEntry({ ...editingEntry, base_pay: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Overtime Pay</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry.overtime_pay}
                  onChange={(e) => setEditingEntry({ ...editingEntry, overtime_pay: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
