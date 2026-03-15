import { GoogleGenerativeAI } from "@google/generative-ai"
import { getSetting } from "@/lib/settings"

class InterviewGenerator {

  async generate({ resumeText, role, difficulty, questionCount }){

    try{

      const key = await getSetting("GEMINI_API_KEY")
      if(!key) throw new Error("Missing Gemini API key")

      const genAI = new GoogleGenerativeAI(key)

      const model = genAI.getGenerativeModel(
        { model: "gemini-2.5-flash" },
        { apiVersion: "v1" }
      )

      const prompt = `
You are an experienced professional interviewer responsible for conducting hiring interviews across multiple industries.

Your task is to generate realistic interview questions based on a candidate’s resume.

----------------------------
Candidate Resume
----------------------------
${resumeText}

----------------------------
Interview Configuration
----------------------------
Target Role: ${role}
Difficulty Level: ${difficulty}
Total Questions Required: ${questionCount}

----------------------------
Step 1: Resume Validation
----------------------------
First determine whether the provided text is a valid professional resume.

A valid resume typically includes some of the following:
- professional experience
- projects
- skills
- education
- certifications
- work history

If the text does NOT appear to be a resume or does not contain meaningful professional information, return ONLY this JSON:

{
 "validResume": false,
 "reason": "short explanation"
}

Do NOT generate interview questions if the resume is invalid.

----------------------------
Step 2: Interview Question Generation
----------------------------
If the resume is valid, generate interview questions based on the resume content.

Questions should feel realistic and similar to what a real interviewer might ask during a hiring process.

Mix questions across these categories when possible:

1. Resume clarification
2. Project or experience deep dive
3. Skill or knowledge evaluation
4. Behavioral or situational questions
5. Role-specific problem solving

Guidelines:

- Prioritize technologies, experiences, and projects mentioned in the resume
- Avoid generic textbook questions
- Do NOT invent skills, companies, or experiences that are not present in the resume
- Focus more on recent work or major projects when available
- Difficulty should match the requested level (${difficulty})

Difficulty interpretation:

BEGINNER:
basic understanding, fundamentals, simple behavioral questions

INTERMEDIATE:
practical experience, decision making, real-world scenarios

ADVANCED:
deep expertise, architecture thinking, leadership decisions, complex problem solving

----------------------------
Step 3: Output Format
----------------------------

Return ONLY valid JSON in the following format:

{
 "validResume": true,
 "questions": [
   "question 1",
   "question 2",
   "question 3"
 ]
}

Rules:
- The questions array MUST contain exactly ${questionCount} items
- Each item must be a single string
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include extra text
`

      const result = await model.generateContent({
        contents:[
          {
            role:"user",
            parts:[{ text: prompt }]
          }
        ]
      })

      const response = result.response
      let text = response.text()

      const clean = text.replace(/```json|```/g,'').trim()

      const data = JSON.parse(clean)

      if(!data.questions || !Array.isArray(data.questions)){
        throw new Error("Invalid LLM response")
      }

      return data.questions.slice(0, questionCount)

    }catch(err){
      console.error("INTERVIEW_GENERATOR_ERROR:",err.message)
      throw err
    }

  }

}

export const interviewGenerator = new InterviewGenerator()