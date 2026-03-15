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

    router.push(`/interview-studio/${selectedInterview.id}`)
  }

  useEffect(()=>{
    fetchInterviews()
  },[])

  return (
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto space-y-8">

      {/* Header */}
      <section className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Interview Rehearsel Studio
          </h1>
          <p className="text-gray-500 mt-1">
            Your end point for practicing interview rounds 
          </p>
        </div>

        <button
          onClick={()=>setShowCreateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Plus size={18}/>
          Generate Interview
        </button>

      </section>


      {/* Interview Grid */}

      {interviews.length === 0 && (
        <div className="text-gray-400 text-sm">
          No interviews yet. Generate your first interview.
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {interviews.map((interview)=>(
          <div
            key={interview.id}
            className="border rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between"
          >

            <div className="space-y-2">

              <h3 className="font-semibold text-lg text-gray-800">
                {interview.title}
              </h3>

              <p className="text-sm text-gray-500">
                Difficulty: {interview.difficulty}
              </p>

              <p className="text-sm text-gray-500">
                Questions: {interview.questionCount}
              </p>

              <p className="text-xs text-gray-400">
                Created: {interview.createdAt}
              </p>

            </div>

            <div className="flex gap-2 mt-6">

              <button
                onClick={()=>openModeSelect(interview)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white py-2 rounded-md hover:bg-gray-800"
              >
                <Play size={16}/>
                Start
              </button>

              <button
                onClick={()=>deleteInterview(interview.id)}
                className="p-2 border text-red-600 rounded-md hover:bg-gray-100"
              >
                <Trash2 size={16}/>
              </button>

            </div>

          </div>
        ))}

      </section>


      {/* CREATE INTERVIEW MODAL */}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-6">

            <h2 className="text-xl font-semibold">
              Generate Interview
            </h2>

            {/* Upload */}

            <div className="space-y-2">

              <label className="text-sm text-gray-600">
                Upload Resume
              </label>

              <div className="border rounded-lg p-4 flex items-center gap-3">

                <FileUp size={20}/>

                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFile}
                  className="text-sm"
                />

              </div>

            </div>


            {/* Role */}

            <div className="space-y-2">

              <label className="text-sm text-gray-600">
                Target Role
              </label>

              <input type="text"                 
                value={form.targetRole}
                onChange={(e)=>setForm({...form,targetRole:e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g Junior Frontend Developer"
              />

            </div>


            {/* Difficulty */}

            <div className="space-y-2">

              <label className="text-sm text-gray-600">
                Difficulty
              </label>

              <div className="flex gap-4">

                {['BEGINNER','INTERMEDIATE','ADVANCED'].map(level=>(
                  <label key={level} className="flex items-center gap-2 text-sm">

                    <input
                      type="radio"
                      checked={form.difficulty===level}
                      onChange={()=>setForm({...form,difficulty:level})}
                    />

                    {level}

                  </label>
                ))}

              </div>

            </div>


            {/* Question Count */}

            <div className="space-y-2">

              <label className="text-sm text-gray-600">
                Number of Questions
              </label>

              <input
                type="range"
                min="3"
                max="50"
                value={form.questionCount}
                onChange={(e)=>setForm({...form,questionCount:Number(e.target.value)})}
                className="w-full"
              />

              <div className="text-sm text-gray-500">
                {form.questionCount} questions
              </div>

            </div>


            {/* Actions */}

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={()=>setShowCreateModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-4 py-2 rounded-md"
              >

                {loading && <Loader2 size={16} className="animate-spin"/>}

                Generate

              </button>

            </div>

          </div>

        </div>
      )}



      {/* MODE SELECTION MODAL */}

      {showModeModal && selectedInterview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-6">

            <h2 className="text-xl font-semibold">
              Select Practice Mode
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <button
                onClick={()=>setMode('chill')}
                className={`border rounded-lg p-4 text-left ${mode==='chill'?'border-black':''}`}
              >

                <Eye className="mb-2"/>

                <p className="font-medium">Chill Mode</p>

                <p className="text-xs text-gray-500">
                  View questions beforehand and prepare your answers.
                </p>

              </button>


              <button
                onClick={()=>setMode('blind')}
                className={`border rounded-lg p-4 text-left ${mode==='blind'?'border-black':''}`}
              >

                <EyeOff className="mb-2"/>

                <p className="font-medium">Blind Mode</p>

                <p className="text-xs text-gray-500">
                  Questions appear suddenly like a real interview.
                </p>

              </button>

            </div>


            {/* Timer */}

            <div className="space-y-2">

              <label className="text-sm text-gray-600 flex items-center gap-2">
                <Clock size={16}/>
                Timer per Question (optional)
              </label>

              <input
                type="number"
                step="1"
                min="1"
                onChange={(e)=>setTimer(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g. 1 (minutes)"
              />

            </div>


            <div className="flex justify-end gap-3">

              <button
                onClick={()=>setShowModeModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={startInterview}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-4 py-2 rounded-md"
              >

                <Headphones size={16}/>
                Start Interview

              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  )
}