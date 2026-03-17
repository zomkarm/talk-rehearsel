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
      <main className="flex-1 bg-white p-8 overflow-y-auto">
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </main>
    )
  }

return (
    <main className="flex-1 bg-white p-8 overflow-y-auto">
      {/* ================= Header ================= */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-600 rounded-full" />
            Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage your account preferences and studio profile.
          </p>
        </div>
      </section>

      {/* ================= Settings Content ================= */}
      <div className="max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
              
              <div className="relative inline-block group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white transition-transform group-hover:scale-[1.02]">
                  {file ? (
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                  ) : profile.profile_pic ? (
                    <img src={`/profile_pics/${profile.profile_pic}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                      <UserIcon size={48} />
                    </div>
                  )}
                </div>
                
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-all border-4 border-slate-50">
                  <Upload size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{profile.name || "Studio User"}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">TalkRehearsel Member</p>
              </div>
            </div>

            <div className="p-5 bg-teal-50/50 border border-teal-100 rounded-2xl">
              <p className="text-[11px] text-teal-800 font-medium leading-relaxed">
                Your profile details help us personalize your practice sessions. Only your name is used for rehearsal context.
              </p>
            </div>
          </div>

          {/* Right Column: Account Forms */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <UserIcon size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Account Details</h3>
              </div>

              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Registered Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">READ ONLY</div>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Display Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-10 pt-6 border-t border-slate-50 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
                >
                  {saving ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
