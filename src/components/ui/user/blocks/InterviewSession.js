'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SkipForward, RotateCcw, Mic, Clock } from 'lucide-react'
import { useInterviewSessionStore } from '@/store/interviewSessionStore'


/* -------------------- TIMER DISPLAY -------------------- */

function TimerDisplay({timeLeft}){

  return (
    <div className="flex items-center gap-2 text-indigo-400 font-mono text-lg">

      <Clock size={18}/>

      {Math.floor(timeLeft/60)}:
      {(timeLeft % 60).toString().padStart(2,'0')}

    </div>
  )

}


/* -------------------- INTERVIEWER PANEL -------------------- */

function InterviewerPanel(){

  return (

    <div className="flex flex-col items-center gap-4">

      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold shadow-xl">
        AI
      </div>

      <span className="text-sm text-slate-400">
        Interviewer
      </span>

    </div>

  )

}


/* -------------------- CANDIDATE PANEL -------------------- */

function CandidatePanel({showTimer}){

  return (

    <div className="flex flex-col items-center gap-4">

      <div className="relative w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">

        {showTimer && (
          <span className="absolute inset-0 rounded-full border-2 border-indigo-500 animate-ping"></span>
        )}

        <Mic size={26}/>

      </div>

      <span className="text-sm text-slate-400">
        Candidate
      </span>

    </div>

  )

}


/* -------------------- QUESTION STAGE -------------------- */

function QuestionStage({
  question,
  showTimer,
  startAnswer,
  restartQuestion,
  nextQuestion,
  sessionTimer,
  timeLeft
}){

  return (

    <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-14 shadow-[0_10px_60px_rgba(0,0,0,0.6)] transition-all duration-300">

      {!showTimer && (

        <div className="space-y-10">

          <p className="text-3xl leading-relaxed text-slate-200 font-medium max-w-3xl">
            {question}
          </p>

          <div className="flex gap-4">

            <button
              onClick={startAnswer}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition"
            >
              <Mic size={18}/>
              Start Answer
            </button>

            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
            >
              <SkipForward size={18}/>
              Skip
            </button>

          </div>

        </div>

      )}


      {showTimer && (

        <div className="flex flex-col items-center gap-10 text-center">

          <div className="relative">

            <span className="absolute inset-0 rounded-full bg-indigo-500/40 animate-ping"></span>

            <div className="relative w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center shadow-xl">
              <Mic size={32}/>
            </div>

          </div>

          <p className="text-xl text-slate-200">
            Speak your answer
          </p>

          {sessionTimer > 0 && (

            <p className="text-4xl font-mono text-indigo-400">

              {Math.floor(timeLeft/60)}:
              {(timeLeft % 60).toString().padStart(2,'0')}

            </p>

          )}

          <div className="flex gap-4">

            <button
              onClick={restartQuestion}
              className="flex items-center gap-2 px-5 py-2 rounded-lg border border-white/20 hover:bg-white/10"
            >
              <RotateCcw size={16}/>
              Restart
            </button>

            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600"
            >
              <SkipForward size={16}/>
              Next
            </button>

          </div>

        </div>

      )}

    </div>

  )

}



/* ========================================================= */
/* ===================== MAIN COMPONENT ==================== */
/* ========================================================= */

export default function InterviewSession(){

  const { id } = useParams()
  const router = useRouter()

  const {
    sessionQuestions,
    setSessionQuestions,
    sessionCurrentIndex,
    nextSessionQuestion,
    sessionCompleted,
    sessionTimer,
    resetSession,
    setSessionCompleted,
    setSesionCurrentIndex
  } = useInterviewSessionStore()

  const [loading,setLoading] = useState(true)
  const [showTimer,setShowTimer] = useState(false)
  const [timeLeft,setTimeLeft] = useState(0)

  const timerRef = useRef(null)

  const currentQuestion = sessionQuestions?.[sessionCurrentIndex]



  /* -------------------- FETCH -------------------- */

  async function fetchQuestions(){

    try{

      const res = await fetch(`/api/interview-studio/${id}`)

      if(!res.ok){
        throw new Error('Failed to fetch questions')
      }

      const data = await res.json()

      setSessionQuestions(data.questions)

    }catch(err){

      console.error(err)
      router.push('/user/interview-studio')

    }finally{
      setLoading(false)
    }

  }

  useEffect(()=>{
    fetchQuestions()
  },[])



  /* -------------------- TIMER -------------------- */

  function startAnswer(){

    if(showTimer) return

    setShowTimer(true)

    if(sessionTimer <= 0) return

    const seconds = sessionTimer * 60

    setTimeLeft(seconds)

    timerRef.current = setInterval(()=>{

      setTimeLeft(prev => {

        if(prev <= 1){
          clearInterval(timerRef.current)
          return 0
        }

        return prev - 1

      })

    },1000)

  }


  function restartQuestion(){

    if(timerRef.current){
      clearInterval(timerRef.current)
    }

    setShowTimer(false)
    setTimeLeft(0)

  }


  function nextQuestion(){

    restartQuestion()
    nextSessionQuestion()

  }



  /* -------------------- NAVIGATION -------------------- */

  function retryInterview(){

    setSesionCurrentIndex(0)
    setSessionCompleted(false)

    router.replace(`/user/interview-studio/${id}`)

  }

  function goToStudio(){

    resetSession()
    router.push('/user/interview-studio')

  }



  /* -------------------- LOADING -------------------- */

  if(loading){

    return (
      <main className="flex items-center justify-center h-screen bg-black text-white">
        Preparing interview session...
      </main>
    )

  }



  /* -------------------- COMPLETED -------------------- */

  if(sessionCompleted){

    return (

      <main className="flex flex-col items-center justify-center h-screen text-center gap-6 bg-black text-white">

        <h1 className="text-4xl font-semibold">
          Interview Completed
        </h1>

        <p className="text-slate-400">
          Nice work finishing your rehearsal session.
        </p>

        <div className="flex gap-4">

          <button
            onClick={retryInterview}
            className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600"
          >
            Retry
          </button>

          <button
            onClick={goToStudio}
            className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10"
          >
            Back to Studio
          </button>

        </div>

      </main>

    )

  }



  /* -------------------- UI -------------------- */

  return (

    <main className="min-h-screen bg-gradient-to-b from-slate-800 to-black  text-white flex items-center justify-center px-8">

      <div className="w-full max-w-6xl space-y-10">

        {/* Header */}

        <div className="flex justify-between text-sm text-slate-400">

          <span>
            Question {sessionCurrentIndex + 1} / {sessionQuestions.length}
          </span>

          {showTimer && sessionTimer > 0 && (
            <TimerDisplay timeLeft={timeLeft}/>
          )}

        </div>


        {/* Interview Layout */}

        <div className="flex items-start gap-12">

          <InterviewerPanel/>

          <QuestionStage
            question={currentQuestion?.question_text}
            showTimer={showTimer}
            startAnswer={startAnswer}
            restartQuestion={restartQuestion}
            nextQuestion={nextQuestion}
            sessionTimer={sessionTimer}
            timeLeft={timeLeft}
          />

          <CandidatePanel showTimer={showTimer}/>

        </div>

      </div>

    </main>

  )

}