'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, Video, Square,ShieldCheck, Play } from 'lucide-react'

export default function UnscriptedPractice() {
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [mediaType, setMediaType] = useState(null) // 'audio' | 'video'
  const [recordedUrl, setRecordedUrl] = useState(null)
  const [category, setCategory] = useState('casual')

  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const chunksRef = useRef([])

  /* ----------------------------
     Fetch Random Question
  ----------------------------- */
  async function fetchRandomQuestion() {
    setLoading(true)
    setQuestion(null)
    setRecordedUrl(null)

    try {
      const res = await fetch(`/api/unscripted-practice/random?category=${category}`)
      const data = await res.json()
      console.log(data)
      setQuestion(data)
    } catch (err) {
      console.error('Failed to fetch question', err)
    } finally {
      setLoading(false)
    }
  }

  /* ----------------------------
     Start Recording
  ----------------------------- */
  async function startRecording(type) {
    setMediaType(type)
    setRecordedUrl(null)

    const constraints =
      type === 'video'
        ? { video: true, audio: true }
        : { audio: true }

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    mediaStreamRef.current = stream

    const recorder = new MediaRecorder(stream)
    mediaRecorderRef.current = recorder
    chunksRef.current = []

    recorder.ondataavailable = e => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType,
      })
      const url = URL.createObjectURL(blob)
      setRecordedUrl(url)

      stream.getTracks().forEach(track => track.stop())
    }

    recorder.start()
    setRecording(true)
  }

  /* ----------------------------
     Stop Recording
  ----------------------------- */
  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  }

return (
  <main className="flex-1 bg-white p-8 overflow-y-auto">
    {/* Full width container - removed max-w-4xl */}
    <div className="max-w-7xl mx-auto space-y-10 mb-20">
      
      {/* ================= Header Section ================= */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-2 h-6 bg-teal-500 rounded-full" />
            Unscripted Practice
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Build natural fluency in a pressure-free environment. No scoring, no logs, just pure practice.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 self-start">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Private Session</span>
        </div>
      </section>

      {/* ================= Top Configuration Bar ================= */}
      <section className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-1 items-center gap-4 w-full">
          <div className="shrink-0 text-[10px] font-black uppercase tracking-wider text-slate-400 ml-2">
            Context:
          </div>
          <select
            value={category}
            onChange={handleChangeCategory}
            className="flex-1 md:max-w-xs px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
          >
            <option value="casual">Everyday Casual</option>
            <option value="social">Opinions & Social</option>
            <option value="professional">Professional / Work</option>
          </select>
        </div>

        <button
          onClick={fetchRandomQuestion}
          disabled={loading}
          className="w-full md:w-auto px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
        >
          {loading ? 'Thinking...' : 'Generate New Prompt'}
        </button>
      </section>

      {/* ================= Main Stage ================= */}
      <section className="min-h-[400px]">
        {!question ? (
          <div className="h-[400px] border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center p-10">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Mic size={32} />
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Ready to practice?</p>
            <p className="text-slate-400 text-xs mt-1">Select a context above and generate a prompt to begin.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            
            {/* The Prompt - Center Stage */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-10 shadow-xl shadow-slate-100/50 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-20 bg-teal-500 rounded-b-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600 mb-6 block">Current Prompt</span>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-800 leading-tight tracking-tight max-w-4xl mx-auto">
                "{question.question}"
              </h2>
            </div>

            {/* Recording & Playback Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Studio Controls */}
              <div className="bg-slate-900 rounded-3xl p-10 flex flex-col items-center justify-center space-y-8 shadow-2xl shadow-indigo-100">
                <div className="text-center space-y-1">
                  <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest">Live Recording Studio</p>
                  <p className="text-slate-500 text-[11px]">Audio and video are processed locally.</p>
                </div>

                <div className="flex items-center gap-8">
                  {!recording ? (
                    <>
                      <button onClick={() => startRecording('audio')} className="group flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-indigo-500 transition-all border border-white/10 group-hover:scale-110">
                          <Mic size={28} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 group-hover:text-white uppercase tracking-widest transition-colors">Audio Only</span>
                      </button>

                      <button onClick={() => startRecording('video')} className="group flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-teal-500 transition-all border border-white/10 group-hover:scale-110">
                          <Video size={28} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 group-hover:text-white uppercase tracking-widest transition-colors">With Video</span>
                      </button>
                    </>
                  ) : (
                    <button onClick={stopRecording} className="flex flex-col items-center gap-4 group">
                      <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                        <Square size={32} fill="currentColor" />
                      </div>
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em] animate-pulse">Recording...</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Playback Area */}
              <div className={`rounded-3xl border-2 border-slate-100 p-2 shadow-sm transition-all flex items-center justify-center bg-slate-50/50 ${!recordedUrl && 'opacity-40'}`}>
                {recordedUrl ? (
                  <div className="w-full h-full p-6 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Self-Review Playback</h3>
                      <button onClick={() => window.location.reload()} className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest">
                        Discard
                      </button>
                    </div>
                    {mediaType === 'audio' ? (
                      <div className="py-12"><audio controls src={recordedUrl} className="w-full" /></div>
                    ) : (
                      <video controls src={recordedUrl} className="w-full rounded-2xl bg-black aspect-video shadow-2xl" />
                    )}
                  </div>
                ) : (
                  <div className="text-center p-10">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-200 mx-auto mb-3 border border-slate-100">
                      <Play size={20} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Review will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Safety Notice Footer */}
      <section className="max-w-2xl mx-auto pt-10">
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-teal-50/50 border border-teal-100/50">
          <ShieldCheck size={20} className="text-teal-600 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-teal-800 font-medium">
            Your privacy is our priority. Recordings are processed locally in your browser and are never uploaded to any server. They are permanently deleted as soon as you refresh or close this tab.
          </p>
        </div>
      </section>
    </div>
  </main>
);
}
