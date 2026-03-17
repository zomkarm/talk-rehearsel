'use client'

import { useState, useEffect } from 'react'
import { Headphones, Play, Loader2, Trash2, Plus, FileUp, Clock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useInterviewSessionStore } from '@/store/interviewSessionStore'

export default function InterviewStudio() {

  const [interviews,setInterviews] = useState([])
  const [loading,setLoading] = useState(false)

  const [showCreateModal,setShowCreateModal] = useState(false)
  const [showModeModal,setShowModeModal] = useState(false)

  const [selectedInterview,setSelectedInterview] = useState(null)
  const router = useRouter()

  const setSessionInterviewId = useInterviewSessionStore(s => s.setSessionInterviewId)
  const setSessionMode = useInterviewSessionStore(s => s.setSessionMode)
  const setSessionTimer = useInterviewSessionStore(s => s.setSessionTimer)

  const [form,setForm] = useState({
    file:null,
    targetRole:'',
    difficulty:'INTERMEDIATE',
    questionCount:10
  })

  const [mode,setMode] = useState('chill')
  const [timer,setTimer] = useState(0)

  function handleFile(e){
    setForm({...form,file:e.target.files[0]})
  }

  async function fetchInterviews(){
    try{

      const res = await fetch('/api/interview-studio')

      if(!res.ok){
        throw new Error('Failed to fetch interviews')
      }

      const data = await res.json()

      const formatted = data.map(i => ({
        id:i.id,
        title:i.title,
        difficulty:i.difficulty,
        questionCount:i.question_count,
        createdAt:new Date(i.created_at).toLocaleDateString()
      }))

      setInterviews(formatted)

    }catch(err){
      console.error(err)
    }
  }

  async function handleGenerate(){
    if(!form.file || !form.targetRole){
      alert("Please complete all fields")
      return
    }

    try{

      setLoading(true)

      const formData = new FormData()

      formData.append('resume',form.file)
      formData.append('targetRole',form.targetRole)
      formData.append('difficulty',form.difficulty)
      formData.append('questionCount',form.questionCount)

      const res = await fetch('/api/interview-studio',{
        method:'POST',
        body:formData
      })

      if(!res.ok){
        throw new Error('Failed to generate interview')
      }

      await fetchInterviews()

      setShowCreateModal(false)

      setForm({
        file:null,
        targetRole:'',
        difficulty:'INTERMEDIATE',
        questionCount:10
      })
      toast.success("Interview Generated successfully")
    }catch(err){
      console.error(err)
      toast.error("Failed to generate interview")
    }
    finally{
      setLoading(false)
    }
  }

  function openModeSelect(interview){
    setSelectedInterview(interview)
    setShowModeModal(true)
  }

  async function deleteInterview(id){
    try{

      const res = await fetch(`/api/interview-studio/${id}`,{
        method:'DELETE'
      })

      if(!res.ok){
        throw new Error('Delete failed')
      }

      setInterviews(prev=>prev.filter(i=>i.id!==id))

    }catch(err){
      console.error(err)
      alert("Failed to delete interview")
    }

  }

  function startInterview(){

    setSessionInterviewId(selectedInterview.id)
    setSessionMode(mode)
    setSessionTimer(timer)

    router.push(`/user/interview-studio/${selectedInterview.id}`)
  }

  useEffect(()=>{
    fetchInterviews()
  },[])

return (
  <main className="flex-1 bg-white p-8 overflow-y-auto">

    {/* ================= Header ================= */}
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div className="w-2.5 h-8 bg-gradient-to-b from-teal-400 to-indigo-600 rounded-full" />
          Interview Rehearsal Studio
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Master your narrative with AI-generated rounds tailored to your resume.
        </p>
      </div>

      <button
        onClick={() => setShowCreateModal(true)}
        className="flex items-center justify-center gap-3 bg-slate-900 text-white px-5 py-2 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gradient-to-br hover:from-teal-500 hover:to-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95"
      >
        <Plus size={18} strokeWidth={3} />
        Generate Interview
      </button>
    </section>

    {/* ================= Interview Grid ================= */}
    <section>
      {interviews.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] space-y-3">
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No interviews generated yet.</p>
          <p className="text-slate-300 text-xs font-medium">Click "Generate Interview" to start your practice session.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="group border border-slate-200 rounded-[2.5rem] p-7 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
                    {interview.difficulty}
                  </span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {interview.createdAt}
                  </p>
                </div>

                <h3 className="font-black text-xl text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                  {interview.title}
                </h3>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</span>
                    <span className="text-sm font-bold text-slate-700">{interview.questionCount} Units</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8 relative z-10">
                <button
                  onClick={() => openModeSelect(interview)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gradient-to-r hover:from-teal-500 hover:to-indigo-600 transition-all shadow-lg active:scale-95"
                >
                  <Play size={16} fill="currentColor" />
                  Start
                </button>

                <button
                  onClick={() => deleteInterview(interview.id)}
                  className="p-2 border border-slate-100 text-slate-300 rounded-xl hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all active:scale-95"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* ================= MODAL: CREATE INTERVIEW ================= */}
    {showCreateModal && (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-6 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-indigo-600" />
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Generate Interview</h2>
            <p className="text-slate-500 text-sm font-medium">Configure your AI interviewer settings.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Resume Data</label>
              <div className="group border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer relative">
                <FileUp size={24} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                <span className="text-xs font-bold text-slate-400 group-hover:text-teal-600 transition-colors">Select PDF or DOCX</span>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFile}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Role</label>
              <input 
                type="text"                  
                value={form.targetRole}
                onChange={(e) => setForm({...form, targetRole: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all"
                placeholder="e.g. Senior Product Designer"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty Level</label>
              <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2">
                {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm({...form, difficulty: level})}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${form.difficulty === level ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Question Intensity</label>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{form.questionCount}</span>
              </div>
              <input
                type="range" min="3" max="50"
                value={form.questionCount}
                onChange={(e) => setForm({...form, questionCount: Number(e.target.value)})}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 py-3.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gradient-to-r hover:from-teal-500 hover:to-indigo-600 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin"/>}
              Generate
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ================= MODAL: MODE SELECTION ================= */}
    {showModeModal && selectedInterview && (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 space-y-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-indigo-600" />
          
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Practice Mode</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('chill')}
              className={`group border-2 rounded-3xl p-6 text-left transition-all ${mode === 'chill' ? 'border-teal-500 bg-teal-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
            >
              <div className={`p-3 rounded-xl inline-block mb-4 ${mode === 'chill' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Eye size={24} />
              </div>
              <p className="font-black text-slate-900 uppercase tracking-tight text-sm">Chill Mode</p>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">View all questions in advance. Perfect for deep research and script building.</p>
            </button>

            <button
              onClick={() => setMode('blind')}
              className={`group border-2 rounded-3xl p-6 text-left transition-all ${mode === 'blind' ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
            >
              <div className={`p-3 rounded-xl inline-block mb-4 ${mode === 'blind' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <EyeOff size={24} />
              </div>
              <p className="font-black text-slate-900 uppercase tracking-tight text-sm">Blind Mode</p>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Questions are hidden until asked. Mimics a high-pressure real interview.</p>
            </button>
          </div>

          <div className="space-y-3 bg-slate-50 p-6 rounded-2xl">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" />
              Response Timer (Minutes)
            </label>
            <input
              type="number" step="1" min="1"
              onChange={(e) => setTimer(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all"
              placeholder="Leave empty for no limit"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowModeModal(false)}
              className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={startInterview}
              className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gradient-to-r hover:from-teal-500 hover:to-indigo-600 shadow-xl transition-all active:scale-95"
            >
              <Headphones size={18} />
              Enter Rehearsal
            </button>
          </div>
        </div>
      </div>
    )}
  </main>
)
}