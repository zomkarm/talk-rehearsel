import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'
import { parseResume } from '@/lib/resume/parser'
import { interviewGenerator } from '@/lib/ai/interviewGenerator'

export async function GET() {
  try {
    const user = await getUserFromToken()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const interviews = await prisma.interview.findMany({
      where: {
        user_id: user.id
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        title: true,
        target_role: true,
        difficulty: true,
        question_count: true,
        created_at: true
      }
    })

    return NextResponse.json(interviews)

  } catch (err) {
    console.error('Fetch interviews error:', err)

    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    )
  }
}


export async function POST(req) {

  try {

    const user = await getUserFromToken()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()

    const resumeFile = formData.get('resume')
    const targetRole = formData.get('targetRole')
    const difficulty = formData.get('difficulty')
    const questionCount = Number(formData.get('questionCount'))

    if (!resumeFile || !targetRole || !difficulty || !questionCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: "Unsupported resume format" },
        { status: 400 }
      )
    }

    /* -------------------------
       1. Parse Resume
    -------------------------- */

    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume file too large. Max size is 2MB." },
        { status: 400 }
      )
    }

    const resumeText = await parseResume(resumeFile)

    if(!resumeText || resumeText.length < 100){
      return NextResponse.json(
        { error:'Invalid resume content' },
        { status:400 }
      )
    }

    /* -------------------------
       2. Generate Questions
    -------------------------- */

    const result = await interviewGenerator.generate({
      resumeText,
      role: targetRole,
      difficulty,
      questionCount
    })

    if (!result.validResume) {
      return NextResponse.json(
        { error: result.reason || "Invalid resume" },
        { status: 400 }
      )
    }

    const questions = result.questions || []

    if (questions.length !== questionCount) {
      throw new Error("Invalid question generation")
    }

    /* -------------------------
       3. Prepare DB Format
    -------------------------- */

    const questionRecords = questions.map((q,i)=>({
      order_index: i + 1,
      question_text: q
    }))

    /* -------------------------
       4. Transaction Insert
    -------------------------- */

    const interview = await prisma.$transaction(async(tx)=>{

      const createdInterview = await tx.interview.create({
        data:{
          user_id:user.id,
          title:targetRole,
          target_role:targetRole,
          difficulty,
          question_count: questions.length
        }
      })

      await tx.interviewQuestion.createMany({
        data: questionRecords.map(q => ({
          ...q,
          interview_id: createdInterview.id
        }))
      })

      return createdInterview
    })

    /* -------------------------
       5. Response
    -------------------------- */

    return NextResponse.json({
      success:true,
      interviewId:interview.id
    })

  } catch (err) {

    console.error("INTERVIEW_GENERATION_ERROR", err)

    return NextResponse.json(
      { error: 'Failed to generate interview' },
      { status: 500 }
    )
  }

}