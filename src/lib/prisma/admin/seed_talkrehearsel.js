import prisma from "@/lib/prisma/client";

export async function TalkRehearselSeeder() {
  try {
    console.log("🌱 Seeding TalkRehearsel data...");

    // 1️⃣ Clean tables (FK-safe order)
    await prisma.$transaction([
      prisma.recording.deleteMany(),
      prisma.lineVoice.deleteMany(),
      prisma.line.deleteMany(),
      prisma.actor.deleteMany(),
      prisma.situation.deleteMany(),
    ]);

    const accents = ["en-IN", "en-US", "en-GB"];

    // Helper to seed one situation
    async function seedSituation({ title, description, actors, lines }) {
      const situation = await prisma.situation.create({
        data: { title, description },
      });

      const actorMap = {};

      // Create actors
      for (const actor of actors) {
        const createdActor = await prisma.actor.create({
          data: {
            situation_id: situation.id,
            name: actor.name,
            order: actor.order,
          },
        });
        actorMap[actor.key] = createdActor;
      }

      // Create lines
      for (const line of lines) {
        const createdLine = await prisma.line.create({
          data: {
            situation_id: situation.id,
            actor_id: actorMap[line.actorKey].id,
            text: line.text,
            order: line.order,
          },
        });

        // Create voices per accent
        await prisma.lineVoice.createMany({
          data: accents.map((accent) => ({
            line_id: createdLine.id,
            accent,
            audio_src: `/audio/demo/${accent}/${title
              .toLowerCase()
              .replace(/\s+/g, "-")}-line-${line.order}.mp3`,
          })),
        });
      }
    }

    // 2️⃣ Situation 1: Interview Introduction
    await seedSituation({
      title: "Interview Introduction",
      description: "Basic interview opening between interviewer and candidate.",
      actors: [
        { key: "interviewer", name: "Interviewer", order: 1 },
        { key: "candidate", name: "Candidate", order: 2 },
      ],
      lines: [
        {
          actorKey: "interviewer",
          text: "Hello, thank you for coming in today. Please introduce yourself.",
          order: 1,
        },
        {
          actorKey: "candidate",
          text: "Thank you for having me. My name is Alex, and I am a full-stack developer.",
          order: 2,
        },
        {
          actorKey: "interviewer",
          text: "Can you briefly describe your recent experience?",
          order: 3,
        },
        {
          actorKey: "candidate",
          text: "I have been working with JavaScript and Node.js on scalable web applications.",
          order: 4,
        },
      ],
    });

    // 3️⃣ Situation 2: Greeting a Friend on Achievement
    await seedSituation({
      title: "Congratulating a Friend",
      description: "Casual conversation to congratulate a friend on an achievement.",
      actors: [
        { key: "friendA", name: "You", order: 1 },
        { key: "friendB", name: "Friend", order: 2 },
      ],
      lines: [
        {
          actorKey: "friendA",
          text: "Hey! I heard about your promotion. Congratulations!",
          order: 1,
        },
        {
          actorKey: "friendB",
          text: "Thank you so much! I really appreciate it.",
          order: 2,
        },
        {
          actorKey: "friendA",
          text: "You totally deserve it. Hard work always pays off.",
          order: 3,
        },
        {
          actorKey: "friendB",
          text: "That means a lot. Thanks again!",
          order: 4,
        },
      ],
    });

    // 4️⃣ Situation 3: Technical Interview – Project Discussion
    await seedSituation({
      title: "Project Discussion",
      description: "Discussing a recent project in a technical interview.",
      actors: [
        { key: "interviewer", name: "Interviewer", order: 1 },
        { key: "candidate", name: "Candidate", order: 2 },
      ],
      lines: [
        {
          actorKey: "interviewer",
          text: "Can you walk me through a recent project you worked on?",
          order: 1,
        },
        {
          actorKey: "candidate",
          text: "Sure. I recently built a production-ready web application using Next.js and PostgreSQL.",
          order: 2,
        },
        {
          actorKey: "interviewer",
          text: "What challenges did you face during development?",
          order: 3,
        },
        {
          actorKey: "candidate",
          text: "Handling scalability and maintaining clean architecture were the main challenges.",
          order: 4,
        },
      ],
    });

    console.log("✅ TalkRehearsel seeded with 3 situations successfully");
  } catch (error) {
    console.error("❌ Failed to seed TalkRehearsel:", error);
  }
}
