import { NextResponse } from "next/server"
import prisma from "@/lib/prisma/client"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req, { params }) {
  try {
    const user = await getUserFromToken()

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const situation = await prisma.situation.findUnique({
      where: {
        id: params.situationId,
      },
      include: {
        lines: {
          orderBy: { order: "asc" },
          include: {
            actor: true,
            voices: true,
            recordings: {
              where: {
                user_id: user.id,
              },
            },
          },
        },
      },
    })
    //console.log(situation)
    //console.log("Aaaaa")
    if (!situation) {
      return NextResponse.json({ error: "Situation not found" }, { status: 404 })
    }

    let detectedAccent = null

    for (const line of situation.lines) {
      if (line.recordings.length > 0) {
        // user recorded this line → infer accent
        const matchingVoice = line.voices.find(v =>
          v.audio_src && v.accent
        )

        if (matchingVoice) {
          detectedAccent = matchingVoice.accent
          break
        }
      }
    }

    const conversation = situation.lines.map(line => {
      const userRecording = line.recordings[0]

      let systemVoice = null

      if (detectedAccent) {
        systemVoice = line.voices.find(
          v => v.accent === detectedAccent
        )
      }

      // fallback safety
      if (!systemVoice && line.voices.length > 0) {
        systemVoice = line.voices[0]
      }

      return {
        id: line.id,
        order: line.order,
        actor: {
          id: line.actor.id,
          name: line.actor.name,
        },
        text: line.text,
        audio: userRecording
          ? {
              type: "user",
              src: userRecording.audio_src,
            }
          : systemVoice
          ? {
              type: "system",
              src: systemVoice.audio_src,
            }
          : null,
      }
    })

    //console.log(conversation)
    return NextResponse.json({
      situation: {
        id: situation.id,
        title: situation.title,
      },
      conversation,
    })
  } catch (err) {
    console.error("Conversation API error:", err)
    return NextResponse.json(
      { error: "Failed to load conversation" },
      { status: 500 }
    )
  }
}
