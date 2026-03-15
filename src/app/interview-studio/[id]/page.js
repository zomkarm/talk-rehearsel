'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useInterviewSessionStore } from '@/store/interviewSessionStore'

export default function InterviewSession(){

  const { id } = useParams()
  const searchParams = useSearchParams()

  const mode = searchParams.get('mode')
  const timer = searchParams.get('timer')

  const [loading,setLoading] = useState(true)
  const [currentIndex,setCurrentIndex] = useState(0)
  const sessionQuestions = useInterviewSessionStore(s => s.sessionQuestions)
  const setSessionQuestions = useInterviewSessionStore(s => s.setSessionQuestions)

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
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchQuestions()
  },[])

  if(loading){
    return <div>Loading interview...</div>
  }

  const sessionQuestion = sessionQuestions[currentIndex]

  return (
    <main className="p-10">

      <h2 className="text-xl font-semibold mb-6">
        Question {currentIndex + 1} / {sessionQuestions.length}
      </h2>

      <div className="text-lg mb-10">
        {sessionQuestion.question_text}
      </div>

      <button
        onClick={()=>setCurrentIndex(i=>i+1)}
        disabled={currentIndex === sessionQuestion.length - 1}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Next
      </button>

    </main>
  )
}