import { useState, useEffect } from "react";
import { holidayAPI } from "../utils/api";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Upload,
} from "lucide-react";
import CreateHolidayModal from "../components/holidays/CreateHolidayModal";
import EditHolidayModal from "../components/holidays/EditHolidayModal";

const SkeletonCard = () => (
  <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
    <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
    <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
    <div className="flex space-x-2 mt-4">
      <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
      <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
    </div>
  </div>
);

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState("all");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, [filterYear]);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await holidayAPI.getAll({ year: filterYear });
      setHolidays(response.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load holidays" });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (successMessage) => {
    setMessage({ type: "success", text: successMessage });
    fetchHolidays();
  };

  const handleEdit = (holiday) => {
    setSelectedHoliday(holiday);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?"))
      return;

    try {
      await holidayAPI.delete(id);
      setMessage({ type: "success", text: "Holiday deleted successfully!" });
      fetchHolidays();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete holiday" });
    }
  };

  const handleBulkCreate = async () => {
    if (
      !window.confirm(
        "Create Philippine 2025 holidays? This will add 12 holidays."
      )
    )
      return;

    const philippineHolidays = [
      {
        name: "New Year's Day",
        date: "2025-01-01",
        holiday_type: "regular_holiday",
        is_recurring: true,
      },
      {
        name: "EDSA Revolution",
        date: "2025-02-25",
        holiday_type: "special_holiday",
        is_recurring: true,
      },
      {
        name: "Maundy Thursday",
        date: "2025-04-17",
        holiday_type: "regular_holiday",
        is_recurring: false,
      },
      {
        name: "Good Friday",
        date: "2025-04-18",
        holiday_type: "regular_holiday",
        is_recurring: false,
      },
      {
        name: "Labor Day",
        date: "2025-05-01",
        holiday_type: "regular_holiday",
        is_recurring: true,
      },
      {
        name: "Independence Day",
        date: "2025-06-12",
        holiday_type: "regular_holiday",
        is_recurring: true,
      },
      {
        name: "Ninoy Aquino Day",
        date: "2025-08-21",
        holiday_type: "special_holiday",
        is_recurring: true,
      },
      {
        name: "National Heroes Day",
        date: "2025-08-25",
        holiday_type: "regular_holiday",
        is_recurring: true,
      },
      {
        name: "All Saints' Day",
        date: "2025-11-01",
        holiday_type: "special_holiday",
        is_recurring: true,
      },
      {
        name: "Bonifacio Day",
        date: "2025-11-30",
        holiday_type: "regular_holiday",
        is_recurring: true,
      },
      {
        name: "Christmas Day",
        date: "2025-12-25",
        holiday_type: "regular_holiday",
        is_recurring: true,
      },
      {
        name: "Rizal Day",
        date: "2025-12-30",
        holiday_type: "regular_holiday",
        is_recurring: true,
      },
    ];

    try {
      await holidayAPI.bulkCreate(philippineHolidays);
      setMessage({
        type: "success",
        text: "Philippine 2025 holidays created successfully!",
      });
      fetchHolidays();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create holidays",
      });
    }
  };

  const filteredHolidays = holidays.filter((holiday) => {
    return filterType === "all" || holiday.holiday_type === filterType;
  });

  const getTypeColor = (type) =>
    type === "regular_holiday"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Holidays
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage company holidays and special non-working days
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleBulkCreate}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Upload className="w-5 h-5" />
            <span>PH 2025</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Holiday</span>
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-2 ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white"
          >
            {[2024, 2025, 2026, 2027].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="regular_holiday">Regular Holiday</option>
            <option value="special_holiday">Special Holiday</option>
          </select>
        </div>
      </div>

      {/* Holidays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : filteredHolidays.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              No holidays found for {filterYear}
            </p>
          </div>
        ) : (
          filteredHolidays.map((holiday) => (
            <div
              key={holiday.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                    {holiday.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {new Date(holiday.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      holiday.holiday_type
                    )}`}
                  >
                    {holiday.holiday_type === "regular_holiday"
                      ? "Regular Holiday"
                      : "Special Holiday"}
                  </span>
                  {holiday.is_recurring && (
                    <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Recurring
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(holiday)}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(holiday.id)}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {holiday.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  {holiday.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <CreateHolidayModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
      />
      <EditHolidayModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedHoliday(null);
        }}
        onSuccess={handleSuccess}
        holiday={selectedHoliday}
      />
    </div>
  );
};

export default Holidays;
