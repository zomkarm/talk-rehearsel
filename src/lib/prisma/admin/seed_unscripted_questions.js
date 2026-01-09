import prisma from '@/lib/prisma/client'

export async function UnscriptedQuestionSeeder() {
  try {
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE
        "unscripted_question"
      RESTART IDENTITY CASCADE
    `);

    await prisma.unscriptedQuestion.createMany({
      data: [
        // 🟢 Casual / Comfort Building
        {
          question: "Talk about how you usually spend your weekends. What do you enjoy doing the most and why?",
          level: "casual",
        },
        {
          question: "Describe a hobby or activity you enjoy. How did you get started with it?",
          level: "casual",
        },
        {
          question: "Talk about a movie or TV show you recently watched and what you liked about it.",
          level: "casual",
        },
        {
          question: "Describe a place you like visiting often. What makes it special for you?",
          level: "casual",
        },
        {
          question: "Talk about your daily routine. Which part of the day do you enjoy the most?",
          level: "casual",
        },
        {
          question: "Describe a meal you really enjoy. When do you usually have it and why do you like it?",
          level: "casual",
        },
        {
          question: "Talk about a small achievement that made you happy recently.",
          level: "casual",
        },
        {
          question: "Describe a habit you are trying to build or improve.",
          level: "casual",
        },
        {
          question: "Talk about something that helps you relax after a long day.",
          level: "casual",
        },
        {
          question: "Describe a person you enjoy spending time with and why.",
          level: "casual",
        },

        // 🟡 Social / Confidence Building
        {
          question: "Talk about a time when you had to introduce yourself to someone new. How did it go?",
          level: "social",
        },
        {
          question: "Describe a situation where you helped someone or received help from someone.",
          level: "social",
        },
        {
          question: "Talk about a conversation you enjoyed recently. What made it engaging?",
          level: "social",
        },
        {
          question: "Describe a situation where you had to explain something clearly to another person.",
          level: "social",
        },
        {
          question: "Talk about a time you felt nervous speaking but continued anyway.",
          level: "social",
        },
        {
          question: "Describe how you usually start conversations with new people.",
          level: "social",
        },
        {
          question: "Talk about a time when you shared your opinion in a group discussion.",
          level: "social",
        },
        {
          question: "Describe a situation where listening carefully helped you understand someone better.",
          level: "social",
        },
        {
          question: "Talk about a social interaction that helped you gain confidence.",
          level: "social",
        },
        {
          question: "Describe how you usually handle silence during conversations.",
          level: "social",
        },

        // 🟠 Semi-Professional / Thought Structuring
        {
          question: "Explain a problem you noticed recently and how you would approach solving it.",
          level: "professional",
        },
        {
          question: "Talk about a task or responsibility you handled independently.",
          level: "professional",
        },
        {
          question: "Describe a situation where you had to learn something new quickly.",
          level: "professional",
        },
        {
          question: "Explain how you organize your work or studies to stay productive.",
          level: "professional",
        },
        {
          question: "Talk about a challenge you faced and what steps you took to overcome it.",
          level: "professional",
        },
        {
          question: "Describe how you handle feedback or criticism.",
          level: "professional",
        },
        {
          question: "Explain a topic you feel confident talking about and why.",
          level: "professional",
        },
        {
          question: "Talk about a decision you made after careful thinking.",
          level: "professional",
        },
        {
          question: "Describe how you prioritize tasks when everything feels important.",
          level: "professional",
        },
        {
          question: "Talk about a situation where clear communication helped avoid confusion.",
          level: "professional",
        },

        // 🔵 Interview / Professional Speaking
        {
          question: "Introduce yourself as if you were in a professional interview.",
          level: "professional",
        },
        {
          question: "Talk about your strengths and how they help you in work or studies.",
          level: "professional",
        },
        {
          question: "Describe a weakness you are actively working on improving.",
          level: "professional",
        },
        {
          question: "Explain a project you worked on and what your role was.",
          level: "professional",
        },
        {
          question: "Talk about a time you handled pressure or tight deadlines.",
          level: "professional",
        },
        {
          question: "Describe a situation where teamwork played an important role.",
          level: "professional",
        },
        {
          question: "Explain how you handle mistakes and what you learn from them.",
          level: "professional",
        },
        {
          question: "Talk about your long-term goals and how you plan to achieve them.",
          level: "professional",
        },
        {
          question: "Describe a professional challenge you expect to face in the future.",
          level: "professional",
        },
        {
          question: "Explain why effective communication is important in professional environments.",
          level: "professional",
        },
        // 🟢 Casual / Comfort Building (More Variety)
        {
          question: "Talk about a recent day that felt productive. What made it productive for you?",
          level: "casual",
        },
        {
          question: "Describe something new you tried recently and how it made you feel.",
          level: "casual",
        },
        {
          question: "Talk about a habit you want to break and why.",
          level: "casual",
        },
        {
          question: "Describe a simple moment that made you smile recently.",
          level: "casual",
        },
        {
          question: "Talk about how you usually start your mornings.",
          level: "casual",
        },
        {
          question: "Describe a place where you feel calm and relaxed.",
          level: "casual",
        },
        {
          question: "Talk about a skill you want to improve and your motivation behind it.",
          level: "casual",
        },
        {
          question: "Describe a conversation that taught you something valuable.",
          level: "casual",
        },
        {
          question: "Talk about how you usually spend your free time.",
          level: "casual",
        },
        {
          question: "Describe something you are grateful for and why.",
          level: "casual",
        },

        // 🟡 Social / Interaction Confidence
        {
          question: "Talk about a time when you had to explain your thoughts clearly to someone.",
          level: "social",
        },
        {
          question: "Describe a situation where you disagreed with someone respectfully.",
          level: "social",
        },
        {
          question: "Talk about how you usually react when meeting new people.",
          level: "social",
        },
        {
          question: "Describe a time when you helped resolve a misunderstanding.",
          level: "social",
        },
        {
          question: "Talk about how you express appreciation to others.",
          level: "social",
        },
        {
          question: "Describe a situation where active listening made a difference.",
          level: "social",
        },
        {
          question: "Talk about a time when you had to ask for clarification.",
          level: "social",
        },
        {
          question: "Describe how you handle awkward moments in conversations.",
          level: "social",
        },
        {
          question: "Talk about a social interaction that challenged you.",
          level: "social",
        },
        {
          question: "Describe how you usually close a conversation politely.",
          level: "social",
        },

        // 🟠 Semi-Professional / Thinking Aloud
        {
          question: "Explain how you approach solving a problem step by step.",
          level: "professional",
        },
        {
          question: "Talk about a task that required careful planning.",
          level: "professional",
        },
        {
          question: "Describe a situation where you had to adapt quickly.",
          level: "professional",
        },
        {
          question: "Explain how you manage distractions while working or studying.",
          level: "professional",
        },
        {
          question: "Talk about a situation where you had to make a quick decision.",
          level: "professional",
        },
        {
          question: "Describe how you usually prepare before starting something important.",
          level: "professional",
        },
        {
          question: "Explain how you handle multiple responsibilities at once.",
          level: "professional",
        },
        {
          question: "Talk about a mistake that taught you an important lesson.",
          level: "professional",
        },
        {
          question: "Describe a time when you had to explain a complex idea simply.",
          level: "professional",
        },
        {
          question: "Talk about how you measure personal progress or improvement.",
          level: "professional",
        },

        // 🔵 Interview / Professional Presence
        {
          question: "Describe a professional situation where communication played a key role.",
          level: "professional",
        },
        {
          question: "Talk about how you stay motivated during long or difficult tasks.",
          level: "professional",
        },
        {
          question: "Explain how you handle uncertainty or unclear instructions.",
          level: "professional",
        },
        {
          question: "Describe a time when you took responsibility for an outcome.",
          level: "professional",
        },
        {
          question: "Talk about how you handle stress in professional settings.",
          level: "professional",
        },
        {
          question: "Explain how you ensure clarity when sharing information.",
          level: "professional",
        },
        {
          question: "Describe a situation where patience was important.",
          level: "professional",
        },
        {
          question: "Talk about how you would introduce yourself in a professional meeting.",
          level: "professional",
        },
        {
          question: "Explain what effective teamwork means to you.",
          level: "professional",
        },
        {
          question: "Describe how you approach continuous learning and growth.",
          level: "professional",
        },
      ],
    })

    console.log('Added Unscripted questions successfully')
  } catch (err) {
    console.error('Failure while adding Unscripted questions:', err)
  }
}
