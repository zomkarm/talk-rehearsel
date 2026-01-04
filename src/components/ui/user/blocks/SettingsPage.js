'use client'

import { useEffect, useState } from 'react'
import { User as UserIcon, Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '', profile_pic: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          console.log(data)
          setProfile(data)
        }
      } catch (err) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('name', profile.name)
      if (file) formData.append('profile_pic', file)

      const res = await fetch('/api/user', {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Update failed')
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 bg-white p-8 mt-2 border-2 rounded-tl-3xl overflow-y-auto">
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-white p-8 mt-2 border-2 rounded-tl-3xl overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
        Settings
      </h1>
      <div className="max-w-lg mx-auto bg-white shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <UserIcon className="w-6 h-6 text-indigo-600" />
          <h1 className="text-lg font-semibold text-gray-800">My Account</h1>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : profile.profile_pic ? (
              <img
                src={`/profile_pics/${profile.profile_pic}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <UserIcon className="w-10 h-10" />
              </div>
            )}
          </div>
          <label className="mt-3 cursor-pointer text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">
            <Upload className="w-4 h-4" />
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </main>
  )
}
