"use client"

import { useState, useEffect } from "react"
import { UserPlus, ChevronLeft, ChevronRight } from "lucide-react"
import { userAPI } from "../utils/api"
import UsersTable from "../components/users/UsersTable"
import UserFilters from "../components/users/UserFilters"
import CreateUserModal from "../components/users/CreateUserModal"
import EditUserModal from "../components/users/EditUserModal"
import ResetPasswordModal from "../components/users/ResetPasswordModal"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    is_active: "",
    sort_by: "created_at",
    sort_order: "desc",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [pagination.page])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      }

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })

      const response = await userAPI.getAll(params)
      setUsers(response?.data?.data)
      setPagination({
        ...pagination,
        total: response.data?.total,
        pages: response.data?.pages,
      })
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 })
    fetchUsers()
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      try {
        await userAPI.delete(user.id)
        fetchUsers()
      } catch (error) {
        alert(error.message || "Failed to deactivate user")
      }
    }
  }

  const handleActivate = async (user) => {
    if (window.confirm(`Are you sure you want to activate ${user.name}?`)) {
      try {
        await userAPI.activate(user.id)
        fetchUsers()
      } catch (error) {
        alert(error.message || "Failed to activate user")
      }
    }
  }

  const handleResetPassword = (user) => {
    setSelectedUser(user)
    setShowResetPasswordModal(true)
  }

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white" data-testid="users-title">
            Users
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Manage system users and their permissions ({pagination?.total} total)</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          data-testid="add-users-button"
        >
          <UserPlus className="w-5 h-5" />
          <span>Create User</span>
        </button>
      </div>

      {/* Filters */}
      <UserFilters filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} />

      {/* Users Table */}
      <UsersTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onActivate={handleActivate}
        onResetPassword={handleResetPassword}
      />

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateUserModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={fetchUsers} />
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
      />
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
      />
    </div>
  )
}

export default Users
