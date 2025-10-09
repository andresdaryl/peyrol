"use client"

import { useState, useEffect } from "react"
import { companyAPI } from "../utils/api"
import { Building2, Mail, Phone, MapPin, FileText, Upload, Trash2, Save, AlertCircle } from "lucide-react"
import CompanyProfileSkeleton from "@/components/company/CompanyProfileSkeleton"

const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    company_name: "",
    address: "",
    contact_number: "",
    email: "",
    tax_id: "",
    logo_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [logoPreview, setLogoPreview] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await companyAPI.getProfile()
      setProfile(response.data)
      if (response?.data?.logo_url) {
        setLogoPreview("http://localhost:8000/uploads/company/company_logo.webp")
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load company profile" })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage({ type: "", text: "" })

      const updateData = {
        company_name: profile.company_name,
        address: profile.address || null,
        contact_number: profile.contact_number || null,
        email: profile.email || null,
        tax_id: profile.tax_id || null,
      }

      await companyAPI.updateProfile(updateData)
      setMessage({ type: "success", text: "Company profile updated successfully!" })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setMessage({ type: "error", text: "Only JPEG, PNG, and WebP images are allowed" })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" })
      return
    }

    try {
      setUploadingLogo(true)
      setMessage({ type: "", text: "" })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload to server
      const response = await companyAPI.uploadLogo(file)
      setProfile((prev) => ({ ...prev, logo_url: response.logo_url }))
      setMessage({ type: "success", text: "Logo uploaded successfully!" })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to upload logo" })
      setLogoPreview(profile.logo_url || null)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleDeleteLogo = async () => {
    if (!confirm("Are you sure you want to delete the company logo?")) return

    try {
      setUploadingLogo(true)
      await companyAPI.deleteLogo()
      setProfile((prev) => ({ ...prev, logo_url: "" }))
      setLogoPreview(null)
      setMessage({ type: "success", text: "Logo deleted successfully!" })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to delete logo" })
    } finally {
      setUploadingLogo(false)
    }
  }

  if (loading) {
    return <CompanyProfileSkeleton />
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Company Profile</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your company information and settings</p>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Section */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Company Logo</h2>

            <div className="space-y-4">
              {/* Logo Preview */}
              <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Company Logo"
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <Building2 className="w-20 h-20 text-slate-400" />
                )}
              </div>

              {/* Upload/Delete Buttons */}
              <div className="space-y-2">
                <label className="block">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg cursor-pointer transition-colors disabled:opacity-50">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                  </div>
                </label>

                {logoPreview && (
                  <button
                    onClick={handleDeleteLogo}
                    disabled={uploadingLogo}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Logo</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Accepted formats: JPEG, PNG, WebP. Max size: 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Company Information Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Company Information</h2>

              <div className="space-y-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="company_name"
                      value={profile.company_name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-white"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                      name="address"
                      value={profile.address || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-white resize-none"
                      placeholder="Enter company address"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="contact_number"
                      value={profile.contact_number || ""}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-white"
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email || ""}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-white"
                      placeholder="Enter company email"
                    />
                  </div>
                </div>

                {/* Tax ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tax ID / TIN
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="tax_id"
                      value={profile.tax_id || ""}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-white"
                      placeholder="Enter tax identification number"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Company Policies & Notes Section */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Company Policies & Notes</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Use this section to document company rules, regulations, contracts, payroll policies, or any other important
          information.
        </p>
        <textarea
          rows={8}
          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-white resize-none"
          placeholder="Enter company policies, rules, regulations, contract details, payroll schedules, overtime policies, etc."
        />
        <div className="mt-4 flex justify-end">
          <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
            <Save className="w-4 h-4" />
            <span>Save Policies</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfile
