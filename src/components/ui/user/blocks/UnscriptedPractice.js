'use client'

import { useEffect, useRef, useState } from 'react'

export default function UnscriptedPractice() {
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [mediaType, setMediaType] = useState(null) // 'audio' | 'video'
  const [recordedUrl, setRecordedUrl] = useState(null)

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
      const res = await fetch('/api/unscripted-practice/random')
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

  return (
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-14 text-center mt-6 mb-32">

        {/* ================= Header ================= */}
        <section className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Unscripted Practice
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Practice speaking without scripts, scoring, or judgment.
            This space helps you build confidence by expressing thoughts naturally —
            just like real conversations.
          </p>
        </section>

        {/* ================= Safety Notice ================= */}
        <section>
          <div className="max-w-3xl mx-auto rounded-xl bg-blue-50 border border-blue-100 p-5 text-sm text-blue-800">
            <p className="font-semibold mb-1">
              Private & pressure-free
            </p>
            <p>
              Your recording stays only on this page. Nothing is uploaded or saved.
              Speak freely, reflect, and try again at your own pace.
            </p>
          </div>
        </section>

        {/* ================= Prompt Generator ================= */}
        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Get a speaking prompt
          </h2>

          <button
            onClick={fetchRandomQuestion}
            disabled={loading}
            className="mx-auto inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                       bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                       shadow hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Picking a question...' : '🎲 Generate Random Question'}
          </button>
        </section>

        {/* ================= Practice Area ================= */}
        {question && (
          <section className="space-y-10">

            {/* Question Card */}
            <div className="max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm text-left">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Speaking Prompt
              </p>
              <p className="text-lg font-medium text-gray-900 leading-relaxed">
                {question.question}
              </p>
            </div>

            {/* Recording Controls */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600 max-w-xl mx-auto">
                Speak for about 30–60 seconds. Pauses, restarts, and imperfect sentences
                are completely okay — this is how real speaking works.
              </p>


              <div className="flex justify-center flex-wrap gap-4">
                {!recording ? (
                  <>
                    <button
                      onClick={() => startRecording('audio')}
                      className="px-5 py-2 rounded-lg border border-gray-300
                                 hover:bg-gray-100 transition"
                    >
                      🎙️ Record Audio
                    </button>

                    <button
                      onClick={() => startRecording('video')}
                      className="px-5 py-2 rounded-lg border border-gray-300
                                 hover:bg-gray-100 transition"
                    >
                      🎥 Record Video
                    </button>
                  </>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-2 rounded-lg bg-red-500 text-white
                               font-semibold hover:bg-red-600 transition"
                  >
                    ⏹ Stop Recording
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
  No one else will see or hear this — it’s just you practicing.
</p>

            </div>

            {/* Playback */}
            {recordedUrl && (
              <div className="max-w-3xl mx-auto rounded-xl border border-gray-200 bg-white p-6 space-y-4 text-left">
                <p className="text-sm text-gray-600">
                  Review your response. Notice clarity, pauses, and confidence —
                  not mistakes.
                </p>

                {mediaType === 'audio' ? (
                  <audio controls src={recordedUrl} className="w-full" />
                ) : (
                  <video
                    controls
                    src={recordedUrl}
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            )}
          </section>
        )}

      </div>
    </main>

  )
}
