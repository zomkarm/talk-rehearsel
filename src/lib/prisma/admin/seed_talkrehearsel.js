import prisma from "@/lib/prisma/client";
import fs from "fs";
import path from "path";

export async function TalkRehearselSeeder() {
  try {
    console.log("🌱 Seeding TalkRehearsel data...");

    /* --------------------------------
       CONFIG
    --------------------------------- */
    const accents = ["en-US", "en-GB"];
    const audioManifest = [];

    /* --------------------------------
       CLEAN DATABASE (FK SAFE ORDER)
    --------------------------------- */
    await prisma.$transaction([
      prisma.recording.deleteMany(),
      prisma.lineVoice.deleteMany(),
      prisma.line.deleteMany(),
      prisma.actor.deleteMany(),
      prisma.situation.deleteMany(),
    ]);

    /* --------------------------------
       HELPER: SEED ONE SITUATION
    --------------------------------- */
    async function seedSituation(situation) {
      const { title, description, actors, lines } = situation;

      if (!actors || actors.length !== 2) {
        throw new Error(
          `Situation "${title}" must have exactly 2 actors`
        );
      }

      const createdSituation = await prisma.situation.create({
        data: { title, description },
      });

      const actorMap = {};

      // Create actors
      for (const actor of actors) {
        const createdActor = await prisma.actor.create({
          data: {
            situation_id: createdSituation.id,
            name: actor.name,
            order: actor.order,
          },
        });

        actorMap[actor.key] = createdActor;
      }

      // Create lines + voices
      for (const line of lines) {
        const createdLine = await prisma.line.create({
          data: {
            situation_id: createdSituation.id,
            actor_id: actorMap[line.actorKey].id,
            text: line.text,
            order: line.order,
          },
        });

        for (const accent of accents) {
          const audioPath = `/uploads/talkrehearsel/voices/${accent}/${title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}-line-${line.order}.m4a`;

          await prisma.lineVoice.create({
            data: {
              line_id: createdLine.id,
              accent,
              audio_src: audioPath,
            },
          });

          audioManifest.push({
            situation: title,
            lineOrder: line.order,
            accent,
            text: line.text,
            path: audioPath,
          });
        }
      }
    }

    /* --------------------------------
       SITUATIONS (EMPTY FOR NOW)
    --------------------------------- */

    const situations = [
      {
        title: "Greeting a Friend",
        description: "A casual and friendly greeting between two friends meeting each other.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "friend", name: "Friend", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "Hey, it's so good to see you!", order: 1 },
          { actorKey: "friend", text: "Hey! It's great to see you too.", order: 2 },
          { actorKey: "you", text: "How have you been lately?", order: 3 },
          { actorKey: "friend", text: "I've been doing pretty well. How about you?", order: 4 },
          { actorKey: "you", text: "I've been good, just keeping busy with work.", order: 5 },
          { actorKey: "friend", text: "That sounds nice. Work has been busy for me too.", order: 6 },
          { actorKey: "you", text: "Yeah, time really flies these days.", order: 7 },
          { actorKey: "friend", text: "It really does. Feels like the week just started.", order: 8 },
          { actorKey: "you", text: "Do you have any plans for today?", order: 9 },
          { actorKey: "friend", text: "Not much, just relaxing and catching up.", order: 10 },
          { actorKey: "you", text: "That sounds perfect actually.", order: 11 },
          { actorKey: "friend", text: "Yeah, sometimes doing nothing is the best plan.", order: 12 },
          { actorKey: "you", text: "True. We should hang out more often.", order: 13 },
          { actorKey: "friend", text: "Definitely, we should make time for it.", order: 14 },
          { actorKey: "you", text: "Maybe grab some coffee later?", order: 15 },
          { actorKey: "friend", text: "I would love that.", order: 16 },
          { actorKey: "you", text: "Great, let's do it then.", order: 17 },
          { actorKey: "friend", text: "Sounds good to me.", order: 18 },
          { actorKey: "you", text: "Alright, see you in a bit.", order: 19 },
          { actorKey: "friend", text: "See you soon!", order: 20 }
        ]
      },
      {
        title: "Catching Up After a Long Time",
        description: "Two friends reconnecting after not seeing each other for a long time.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "friend", name: "Friend", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "Wow, it's been such a long time since we last met.", order: 1 },
          { actorKey: "friend", text: "I know, it feels like forever.", order: 2 },
          { actorKey: "you", text: "What have you been up to all this time?", order: 3 },
          { actorKey: "friend", text: "A lot has changed. I moved to a new city.", order: 4 },
          { actorKey: "you", text: "Really? That sounds exciting.", order: 5 },
          { actorKey: "friend", text: "It was challenging at first, but I like it now.", order: 6 },
          { actorKey: "you", text: "What are you doing there these days?", order: 7 },
          { actorKey: "friend", text: "I started a new job and met some great people.", order: 8 },
          { actorKey: "you", text: "That’s awesome. I'm really happy for you.", order: 9 },
          { actorKey: "friend", text: "Thanks! What about you?", order: 10 },
          { actorKey: "you", text: "I've been focusing on my career and learning new skills.", order: 11 },
          { actorKey: "friend", text: "That sounds productive.", order: 12 },
          { actorKey: "you", text: "Yeah, it's been busy but rewarding.", order: 13 },
          { actorKey: "friend", text: "I'm glad things are going well for you.", order: 14 },
          { actorKey: "you", text: "Me too. We should not wait this long again.", order: 15 },
          { actorKey: "friend", text: "Absolutely. Let's stay in touch.", order: 16 },
          { actorKey: "you", text: "Definitely. Maybe meet more often?", order: 17 },
          { actorKey: "friend", text: "I would really like that.", order: 18 },
          { actorKey: "you", text: "Great, let's plan something soon.", order: 19 },
          { actorKey: "friend", text: "Looking forward to it.", order: 20 }
        ]
      },
      {
        title: "Congratulating a Friend",
        description: "A friendly conversation congratulating someone on an achievement.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "friend", name: "Friend", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "Hey, I heard about your achievement. Congratulations!", order: 1 },
          { actorKey: "friend", text: "Thank you so much! That means a lot.", order: 2 },
          { actorKey: "you", text: "You really worked hard for this.", order: 3 },
          { actorKey: "friend", text: "Yeah, it took a lot of effort and patience.", order: 4 },
          { actorKey: "you", text: "I always believed you could do it.", order: 5 },
          { actorKey: "friend", text: "Your support really helped me.", order: 6 },
          { actorKey: "you", text: "So how do you feel now?", order: 7 },
          { actorKey: "friend", text: "I feel relieved and very happy.", order: 8 },
          { actorKey: "you", text: "You should definitely celebrate.", order: 9 },
          { actorKey: "friend", text: "Yes, I'm planning something small.", order: 10 },
          { actorKey: "you", text: "That sounds nice.", order: 11 },
          { actorKey: "friend", text: "It feels good to see the results of hard work.", order: 12 },
          { actorKey: "you", text: "You deserve every bit of it.", order: 13 },
          { actorKey: "friend", text: "Thank you, I really appreciate that.", order: 14 },
          { actorKey: "you", text: "What's your next goal?", order: 15 },
          { actorKey: "friend", text: "I want to keep improving and learning.", order: 16 },
          { actorKey: "you", text: "That's a great mindset.", order: 17 },
          { actorKey: "friend", text: "I'm trying to stay motivated.", order: 18 },
          { actorKey: "you", text: "Keep going. I'm proud of you.", order: 19 },
          { actorKey: "friend", text: "Thanks again. That really means a lot.", order: 20 }
        ]
      },
      {
        title: "Asking for Help Politely",
        description: "A polite conversation where someone asks for help in a casual setting.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "other", name: "Other Person", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "Excuse me, could you help me for a moment?", order: 1 },
          { actorKey: "other", text: "Sure, what do you need help with?", order: 2 },
          { actorKey: "you", text: "I'm trying to find this place, but I'm a bit confused.", order: 3 },
          { actorKey: "other", text: "No problem, let me take a look.", order: 4 },
          { actorKey: "you", text: "Thank you, I really appreciate it.", order: 5 },
          { actorKey: "other", text: "You're welcome. It's actually quite nearby.", order: 6 },
          { actorKey: "you", text: "Oh, that's good to hear.", order: 7 },
          { actorKey: "other", text: "You just need to go straight and turn left.", order: 8 },
          { actorKey: "you", text: "Alright, that sounds simple enough.", order: 9 },
          { actorKey: "other", text: "Yes, you should see it in a few minutes.", order: 10 },
          { actorKey: "you", text: "Thanks for explaining it clearly.", order: 11 },
          { actorKey: "other", text: "Happy to help.", order: 12 },
          { actorKey: "you", text: "I didn't want to disturb you.", order: 13 },
          { actorKey: "other", text: "It's really no trouble at all.", order: 14 },
          { actorKey: "you", text: "That’s very kind of you.", order: 15 },
          { actorKey: "other", text: "Anytime.", order: 16 },
          { actorKey: "you", text: "I'll head there now.", order: 17 },
          { actorKey: "other", text: "Good luck.", order: 18 },
          { actorKey: "you", text: "Thanks again for your help.", order: 19 },
          { actorKey: "other", text: "You're welcome. Have a nice day.", order: 20 }
        ]
      },
      {
        title: "Making Small Talk",
        description: "A light conversation between two people engaging in casual small talk.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "person", name: "Other Person", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "Hi there, how's your day going?", order: 1 },
          { actorKey: "person", text: "It's going well, thanks. How about yours?", order: 2 },
          { actorKey: "you", text: "Pretty good so far.", order: 3 },
          { actorKey: "person", text: "That's nice to hear.", order: 4 },
          { actorKey: "you", text: "The weather is quite nice today.", order: 5 },
          { actorKey: "person", text: "Yes, it's really pleasant.", order: 6 },
          { actorKey: "you", text: "It's a good change from the usual weather.", order: 7 },
          { actorKey: "person", text: "Definitely. I enjoy days like this.", order: 8 },
          { actorKey: "you", text: "Do you come here often?", order: 9 },
          { actorKey: "person", text: "Yes, I usually stop by after work.", order: 10 },
          { actorKey: "you", text: "That sounds like a good routine.", order: 11 },
          { actorKey: "person", text: "It helps me relax.", order: 12 },
          { actorKey: "you", text: "I can see why.", order: 13 },
          { actorKey: "person", text: "What about you?", order: 14 },
          { actorKey: "you", text: "I'm just passing through today.", order: 15 },
          { actorKey: "person", text: "Well, it's nice to meet you.", order: 16 },
          { actorKey: "you", text: "Nice to meet you too.", order: 17 },
          { actorKey: "person", text: "Enjoy the rest of your day.", order: 18 },
          { actorKey: "you", text: "You too.", order: 19 },
          { actorKey: "person", text: "Take care.", order: 20 }
        ]
      },
      {
        title: "Thanking Someone",
        description: "A conversation focused on expressing gratitude politely.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "person", name: "Other Person", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "I just wanted to thank you for your help earlier.", order: 1 },
          { actorKey: "person", text: "You're very welcome.", order: 2 },
          { actorKey: "you", text: "It really made a difference.", order: 3 },
          { actorKey: "person", text: "I'm glad I could help.", order: 4 },
          { actorKey: "you", text: "I appreciate you taking the time.", order: 5 },
          { actorKey: "person", text: "It was no problem at all.", order: 6 },
          { actorKey: "you", text: "Still, it means a lot to me.", order: 7 },
          { actorKey: "person", text: "I'm happy to hear that.", order: 8 },
          { actorKey: "you", text: "You were very kind.", order: 9 },
          { actorKey: "person", text: "That's nice of you to say.", order: 10 },
          { actorKey: "you", text: "I hope I can return the favor someday.", order: 11 },
          { actorKey: "person", text: "I'm sure you will.", order: 12 },
          { actorKey: "you", text: "Thanks again.", order: 13 },
          { actorKey: "person", text: "Anytime.", order: 14 },
          { actorKey: "you", text: "I really appreciate it.", order: 15 },
          { actorKey: "person", text: "You're welcome.", order: 16 },
          { actorKey: "you", text: "Have a great day.", order: 17 },
          { actorKey: "person", text: "You too.", order: 18 },
          { actorKey: "you", text: "Take care.", order: 19 },
          { actorKey: "person", text: "See you around.", order: 20 }
        ]
      },
      {
        title: "Apologizing for Being Late",
        description: "A polite apology after arriving late to meet someone.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "person", name: "Other Person", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "I'm really sorry for being late.", order: 1 },
          { actorKey: "person", text: "It's okay, don't worry.", order: 2 },
          { actorKey: "you", text: "There was unexpected traffic on the way.", order: 3 },
          { actorKey: "person", text: "That happens sometimes.", order: 4 },
          { actorKey: "you", text: "I should have left earlier.", order: 5 },
          { actorKey: "person", text: "No problem at all.", order: 6 },
          { actorKey: "you", text: "Thank you for understanding.", order: 7 },
          { actorKey: "person", text: "Of course.", order: 8 },
          { actorKey: "you", text: "I hope I didn't keep you waiting too long.", order: 9 },
          { actorKey: "person", text: "Not really, it's fine.", order: 10 },
          { actorKey: "you", text: "I appreciate your patience.", order: 11 },
          { actorKey: "person", text: "No worries.", order: 12 },
          { actorKey: "you", text: "Thanks for being flexible.", order: 13 },
          { actorKey: "person", text: "It's not an issue.", order: 14 },
          { actorKey: "you", text: "I'll make sure it doesn't happen again.", order: 15 },
          { actorKey: "person", text: "That's okay.", order: 16 },
          { actorKey: "you", text: "Shall we get started?", order: 17 },
          { actorKey: "person", text: "Yes, let's do that.", order: 18 },
          { actorKey: "you", text: "Thanks again.", order: 19 },
          { actorKey: "person", text: "You're welcome.", order: 20 }
        ]
      },
      {
        title: "Introducing Yourself to a Stranger",
        description: "A polite conversation where two strangers introduce themselves.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "stranger", name: "Stranger", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "Hi, excuse me. I don't think we've met before.", order: 1 },
          { actorKey: "stranger", text: "Oh, no we haven't.", order: 2 },
          { actorKey: "you", text: "My name is Alex.", order: 3 },
          { actorKey: "stranger", text: "Nice to meet you, Alex. I'm Sam.", order: 4 },
          { actorKey: "you", text: "Nice to meet you too.", order: 5 },
          { actorKey: "stranger", text: "Are you new here?", order: 6 },
          { actorKey: "you", text: "Yes, I just started coming here recently.", order: 7 },
          { actorKey: "stranger", text: "That makes sense.", order: 8 },
          { actorKey: "you", text: "How long have you been coming here?", order: 9 },
          { actorKey: "stranger", text: "For about a year now.", order: 10 },
          { actorKey: "you", text: "Oh, that's quite some time.", order: 11 },
          { actorKey: "stranger", text: "Yes, I really like this place.", order: 12 },
          { actorKey: "you", text: "I can see why.", order: 13 },
          { actorKey: "stranger", text: "What brings you here?", order: 14 },
          { actorKey: "you", text: "I wanted to try something new.", order: 15 },
          { actorKey: "stranger", text: "That's always a good idea.", order: 16 },
          { actorKey: "you", text: "I'm glad we talked.", order: 17 },
          { actorKey: "stranger", text: "Me too.", order: 18 },
          { actorKey: "you", text: "Hope to see you again.", order: 19 },
          { actorKey: "stranger", text: "Definitely.", order: 20 }
        ]
      },
      {
        title: "Asking for Directions",
        description: "A conversation where someone asks a stranger for directions.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "stranger", name: "Stranger", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "Excuse me, could you help me?", order: 1 },
          { actorKey: "stranger", text: "Sure, what's the problem?", order: 2 },
          { actorKey: "you", text: "I'm looking for the nearest bus stop.", order: 3 },
          { actorKey: "stranger", text: "It's not too far from here.", order: 4 },
          { actorKey: "you", text: "That's good to know.", order: 5 },
          { actorKey: "stranger", text: "Go straight down this road.", order: 6 },
          { actorKey: "you", text: "Alright.", order: 7 },
          { actorKey: "stranger", text: "Then take the second right.", order: 8 },
          { actorKey: "you", text: "Second right, got it.", order: 9 },
          { actorKey: "stranger", text: "You'll see the bus stop on your left.", order: 10 },
          { actorKey: "you", text: "About how long will it take to walk?", order: 11 },
          { actorKey: "stranger", text: "Around five minutes.", order: 12 },
          { actorKey: "you", text: "That's perfect.", order: 13 },
          { actorKey: "stranger", text: "It's easy to find.", order: 14 },
          { actorKey: "you", text: "Thank you for explaining it so clearly.", order: 15 },
          { actorKey: "stranger", text: "No problem at all.", order: 16 },
          { actorKey: "you", text: "I really appreciate your help.", order: 17 },
          { actorKey: "stranger", text: "You're welcome.", order: 18 },
          { actorKey: "you", text: "Have a great day.", order: 19 },
          { actorKey: "stranger", text: "You too.", order: 20 }
        ]
      },
      {
        title: "Ordering at a Café",
        description: "A conversation between a customer and a café staff member.",
        actors: [
          { key: "customer", name: "Customer", order: 1 },
          { key: "staff", name: "Café Staff", order: 2 }
        ],
        lines: [
          { actorKey: "customer", text: "Hi, can I order something?", order: 1 },
          { actorKey: "staff", text: "Of course. What would you like?", order: 2 },
          { actorKey: "customer", text: "I'd like a cup of coffee, please.", order: 3 },
          { actorKey: "staff", text: "Sure. Would you like it hot or iced?", order: 4 },
          { actorKey: "customer", text: "Hot, please.", order: 5 },
          { actorKey: "staff", text: "Any sugar or milk?", order: 6 },
          { actorKey: "customer", text: "Just a little milk, no sugar.", order: 7 },
          { actorKey: "staff", text: "Got it.", order: 8 },
          { actorKey: "customer", text: "How much is it?", order: 9 },
          { actorKey: "staff", text: "That will be three dollars.", order: 10 },
          { actorKey: "customer", text: "Here you go.", order: 11 },
          { actorKey: "staff", text: "Thank you.", order: 12 },
          { actorKey: "customer", text: "How long will it take?", order: 13 },
          { actorKey: "staff", text: "Just a couple of minutes.", order: 14 },
          { actorKey: "customer", text: "No problem.", order: 15 },
          { actorKey: "staff", text: "You can wait over there.", order: 16 },
          { actorKey: "customer", text: "Alright.", order: 17 },
          { actorKey: "staff", text: "I'll call you when it's ready.", order: 18 },
          { actorKey: "customer", text: "Thank you.", order: 19 },
          { actorKey: "staff", text: "You're welcome.", order: 20 }
        ]
      },
      {
        title: "Talking to a Shop Assistant",
        description: "A customer asks a shop assistant for help finding a product.",
        actors: [
          { key: "customer", name: "Customer", order: 1 },
          { key: "assistant", name: "Shop Assistant", order: 2 }
        ],
        lines: [
          { actorKey: "customer", text: "Excuse me, could you help me?", order: 1 },
          { actorKey: "assistant", text: "Sure, how can I help you?", order: 2 },
          { actorKey: "customer", text: "I'm looking for a pair of running shoes.", order: 3 },
          { actorKey: "assistant", text: "Do you have a specific brand in mind?", order: 4 },
          { actorKey: "customer", text: "Not really. Just something comfortable.", order: 5 },
          { actorKey: "assistant", text: "What size do you usually wear?", order: 6 },
          { actorKey: "customer", text: "Size nine.", order: 7 },
          { actorKey: "assistant", text: "Alright, let me check.", order: 8 },
          { actorKey: "customer", text: "Thank you.", order: 9 },
          { actorKey: "assistant", text: "Here are a few options you might like.", order: 10 },
          { actorKey: "customer", text: "These look good.", order: 11 },
          { actorKey: "assistant", text: "Would you like to try them on?", order: 12 },
          { actorKey: "customer", text: "Yes, please.", order: 13 },
          { actorKey: "assistant", text: "The fitting room is over there.", order: 14 },
          { actorKey: "customer", text: "Alright.", order: 15 },
          { actorKey: "assistant", text: "Take your time.", order: 16 },
          { actorKey: "customer", text: "They feel comfortable.", order: 17 },
          { actorKey: "assistant", text: "That's great to hear.", order: 18 },
          { actorKey: "customer", text: "I'll take this pair.", order: 19 },
          { actorKey: "assistant", text: "Perfect, I'll ring it up for you.", order: 20 }
        ]
      },
      {
        title: "Making a Phone Inquiry",
        description: "A phone conversation where someone calls to ask for information.",
        actors: [
          { key: "caller", name: "Caller", order: 1 },
          { key: "receiver", name: "Receiver", order: 2 }
        ],
        lines: [
          { actorKey: "caller", text: "Hello, am I speaking with customer service?", order: 1 },
          { actorKey: "receiver", text: "Yes, this is customer service. How can I help you?", order: 2 },
          { actorKey: "caller", text: "I'm calling to ask about your working hours.", order: 3 },
          { actorKey: "receiver", text: "We are open from nine in the morning.", order: 4 },
          { actorKey: "caller", text: "And what time do you close?", order: 5 },
          { actorKey: "receiver", text: "We close at six in the evening.", order: 6 },
          { actorKey: "caller", text: "Are you open on weekends?", order: 7 },
          { actorKey: "receiver", text: "Yes, we are open on Saturdays.", order: 8 },
          { actorKey: "caller", text: "What about Sundays?", order: 9 },
          { actorKey: "receiver", text: "We are closed on Sundays.", order: 10 },
          { actorKey: "caller", text: "Alright.", order: 11 },
          { actorKey: "receiver", text: "Is there anything else I can help you with?", order: 12 },
          { actorKey: "caller", text: "Yes, do I need an appointment to visit?", order: 13 },
          { actorKey: "receiver", text: "No, walk-ins are welcome.", order: 14 },
          { actorKey: "caller", text: "That's good to know.", order: 15 },
          { actorKey: "receiver", text: "Feel free to come anytime during working hours.", order: 16 },
          { actorKey: "caller", text: "Thank you for the information.", order: 17 },
          { actorKey: "receiver", text: "You're welcome.", order: 18 },
          { actorKey: "caller", text: "Have a nice day.", order: 19 },
          { actorKey: "receiver", text: "You too. Goodbye.", order: 20 }
        ]
      },
      {
        title: "Booking an Appointment",
        description: "A conversation where someone books an appointment over the phone.",
        actors: [
          { key: "caller", name: "Caller", order: 1 },
          { key: "staff", name: "Staff Member", order: 2 }
        ],
        lines: [
          { actorKey: "caller", text: "Hello, I'd like to book an appointment.", order: 1 },
          { actorKey: "staff", text: "Sure. What kind of appointment is it?", order: 2 },
          { actorKey: "caller", text: "It's for a general consultation.", order: 3 },
          { actorKey: "staff", text: "Alright.", order: 4 },
          { actorKey: "caller", text: "Do you have any availability this week?", order: 5 },
          { actorKey: "staff", text: "Yes, we have openings on Thursday.", order: 6 },
          { actorKey: "caller", text: "What time is available?", order: 7 },
          { actorKey: "staff", text: "We have ten in the morning.", order: 8 },
          { actorKey: "caller", text: "That works for me.", order: 9 },
          { actorKey: "staff", text: "May I have your name, please?", order: 10 },
          { actorKey: "caller", text: "My name is Alex.", order: 11 },
          { actorKey: "staff", text: "Thank you, Alex.", order: 12 },
          { actorKey: "caller", text: "Is there anything I need to bring?", order: 13 },
          { actorKey: "staff", text: "Just your ID.", order: 14 },
          { actorKey: "caller", text: "Alright.", order: 15 },
          { actorKey: "staff", text: "Your appointment is confirmed.", order: 16 },
          { actorKey: "caller", text: "Great, thank you.", order: 17 },
          { actorKey: "staff", text: "You're welcome.", order: 18 },
          { actorKey: "caller", text: "See you on Thursday.", order: 19 },
          { actorKey: "staff", text: "See you then.", order: 20 }
        ]
      },
      {
        title: "Networking Introduction",
        description: "Introducing yourself to a new professional contact at an event.",
        actors: [
          { key: "personA", name: "You", order: 1 },
          { key: "personB", name: "Professional", order: 2 }
        ],
        lines: [
          { actorKey: "personA", text: "Hi, is this seat taken?", order: 1 },
          { actorKey: "personB", text: "No, please go ahead.", order: 2 },
          { actorKey: "personA", text: "Thanks. My name is Alex.", order: 3 },
          { actorKey: "personB", text: "Nice to meet you, Alex. I'm Sam.", order: 4 },
          { actorKey: "personA", text: "Nice to meet you too.", order: 5 },
          { actorKey: "personB", text: "Are you enjoying the event so far?", order: 6 },
          { actorKey: "personA", text: "Yes, it's been really interesting.", order: 7 },
          { actorKey: "personB", text: "What do you do professionally?", order: 8 },
          { actorKey: "personA", text: "I work as a software developer.", order: 9 },
          { actorKey: "personB", text: "That sounds great.", order: 10 },
          { actorKey: "personA", text: "What about you?", order: 11 },
          { actorKey: "personB", text: "I'm in product management.", order: 12 },
          { actorKey: "personA", text: "That's interesting.", order: 13 },
          { actorKey: "personB", text: "Yes, I enjoy working with cross-functional teams.", order: 14 },
          { actorKey: "personA", text: "It must be rewarding.", order: 15 },
          { actorKey: "personB", text: "It definitely is.", order: 16 },
          { actorKey: "personA", text: "Maybe we can stay in touch.", order: 17 },
          { actorKey: "personB", text: "I'd like that.", order: 18 },
          { actorKey: "personA", text: "I'll connect with you after the event.", order: 19 },
          { actorKey: "personB", text: "Sounds good.", order: 20 }
        ]
      },
      {
        title: "Talking to a Senior Colleague",
        description: "A respectful conversation with a senior colleague at work.",
        actors: [
          { key: "junior", name: "You", order: 1 },
          { key: "senior", name: "Senior Colleague", order: 2 }
        ],
        lines: [
          { actorKey: "junior", text: "Good morning.", order: 1 },
          { actorKey: "senior", text: "Good morning. How are you?", order: 2 },
          { actorKey: "junior", text: "I'm doing well, thank you.", order: 3 },
          { actorKey: "senior", text: "That's good to hear.", order: 4 },
          { actorKey: "junior", text: "Do you have a moment?", order: 5 },
          { actorKey: "senior", text: "Yes, go ahead.", order: 6 },
          { actorKey: "junior", text: "I wanted to ask about the current project.", order: 7 },
          { actorKey: "senior", text: "Sure. What would you like to know?", order: 8 },
          { actorKey: "junior", text: "Are there any priorities I should focus on?", order: 9 },
          { actorKey: "senior", text: "Yes, focus on completing the documentation first.", order: 10 },
          { actorKey: "junior", text: "Understood.", order: 11 },
          { actorKey: "senior", text: "Let me know if you face any issues.", order: 12 },
          { actorKey: "junior", text: "I will.", order: 13 },
          { actorKey: "senior", text: "You're doing a good job so far.", order: 14 },
          { actorKey: "junior", text: "Thank you. I appreciate the feedback.", order: 15 },
          { actorKey: "senior", text: "Keep it up.", order: 16 },
          { actorKey: "junior", text: "I will.", order: 17 },
          { actorKey: "senior", text: "Alright, let's catch up later.", order: 18 },
          { actorKey: "junior", text: "Sure. Have a good day.", order: 19 },
          { actorKey: "senior", text: "You too.", order: 20 }
        ]
      },
      {
        title: "Giving a Simple Opinion",
        description: "Sharing a polite opinion during a discussion.",
        actors: [
          { key: "personA", name: "You", order: 1 },
          { key: "personB", name: "Colleague", order: 2 }
        ],
        lines: [
          { actorKey: "personA", text: "Can I share my thoughts on this?", order: 1 },
          { actorKey: "personB", text: "Of course.", order: 2 },
          { actorKey: "personA", text: "I think the current approach works well.", order: 3 },
          { actorKey: "personB", text: "Why do you think so?", order: 4 },
          { actorKey: "personA", text: "It keeps things simple and clear.", order: 5 },
          { actorKey: "personB", text: "That makes sense.", order: 6 },
          { actorKey: "personA", text: "It also saves time.", order: 7 },
          { actorKey: "personB", text: "Time efficiency is important.", order: 8 },
          { actorKey: "personA", text: "Exactly.", order: 9 },
          { actorKey: "personB", text: "Do you see any drawbacks?", order: 10 },
          { actorKey: "personA", text: "Only minor ones.", order: 11 },
          { actorKey: "personB", text: "Like what?", order: 12 },
          { actorKey: "personA", text: "It might limit flexibility.", order: 13 },
          { actorKey: "personB", text: "That's a fair point.", order: 14 },
          { actorKey: "personA", text: "Overall, I still think it's a good option.", order: 15 },
          { actorKey: "personB", text: "Thanks for sharing your opinion.", order: 16 },
          { actorKey: "personA", text: "You're welcome.", order: 17 },
          { actorKey: "personB", text: "It was helpful.", order: 18 },
          { actorKey: "personA", text: "I'm glad.", order: 19 },
          { actorKey: "personB", text: "Let's consider it in the final decision.", order: 20 }
        ]
      },
      {
        title: "Asking for Feedback",
        description: "Politely asking for feedback to improve performance.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "manager", name: "Colleague", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "Do you have a moment to talk?", order: 1 },
          { actorKey: "manager", text: "Sure, what's up?", order: 2 },
          { actorKey: "you", text: "I wanted to ask for some feedback.", order: 3 },
          { actorKey: "manager", text: "Of course.", order: 4 },
          { actorKey: "you", text: "How am I doing on the current task?", order: 5 },
          { actorKey: "manager", text: "Overall, you're doing well.", order: 6 },
          { actorKey: "you", text: "That's good to hear.", order: 7 },
          { actorKey: "manager", text: "There are a few areas to improve.", order: 8 },
          { actorKey: "you", text: "I'd really like to know.", order: 9 },
          { actorKey: "manager", text: "Try to communicate updates more clearly.", order: 10 },
          { actorKey: "you", text: "That makes sense.", order: 11 },
          { actorKey: "manager", text: "Also, feel free to ask questions earlier.", order: 12 },
          { actorKey: "you", text: "I'll keep that in mind.", order: 13 },
          { actorKey: "manager", text: "Other than that, your work quality is strong.", order: 14 },
          { actorKey: "you", text: "Thank you. I appreciate the honesty.", order: 15 },
          { actorKey: "manager", text: "You're welcome.", order: 16 },
          { actorKey: "you", text: "I'll work on improving those points.", order: 17 },
          { actorKey: "manager", text: "Great. Let me know if you need help.", order: 18 },
          { actorKey: "you", text: "I will. Thanks again.", order: 19 },
          { actorKey: "manager", text: "Anytime.", order: 20 }
        ]
      },
      {
        title: "Explaining a Problem",
        description: "Clearly explaining an issue and discussing a possible solution.",
        actors: [
          { key: "you", name: "You", order: 1 },
          { key: "colleague", name: "Colleague", order: 2 }
        ],
        lines: [
          { actorKey: "you", text: "Can I discuss an issue I'm facing?", order: 1 },
          { actorKey: "colleague", text: "Sure, what's the problem?", order: 2 },
          { actorKey: "you", text: "I'm having trouble meeting the deadline.", order: 3 },
          { actorKey: "colleague", text: "What seems to be causing the delay?", order: 4 },
          { actorKey: "you", text: "There are some unexpected technical issues.", order: 5 },
          { actorKey: "colleague", text: "I see.", order: 6 },
          { actorKey: "you", text: "They are taking longer to resolve than expected.", order: 7 },
          { actorKey: "colleague", text: "Have you identified the root cause?", order: 8 },
          { actorKey: "you", text: "Yes, it's related to system integration.", order: 9 },
          { actorKey: "colleague", text: "That can be tricky.", order: 10 },
          { actorKey: "you", text: "I'm working on a solution.", order: 11 },
          { actorKey: "colleague", text: "Do you need any support?", order: 12 },
          { actorKey: "you", text: "Some guidance would be helpful.", order: 13 },
          { actorKey: "colleague", text: "Let's review it together later today.", order: 14 },
          { actorKey: "you", text: "That would be great.", order: 15 },
          { actorKey: "colleague", text: "We'll try to minimize further delays.", order: 16 },
          { actorKey: "you", text: "Thank you for understanding.", order: 17 },
          { actorKey: "colleague", text: "No problem.", order: 18 },
          { actorKey: "you", text: "I'll keep you updated.", order: 19 },
          { actorKey: "colleague", text: "Sounds good.", order: 20 }
        ]
      },
      {
        title: "Interview Introduction",
        description: "Opening conversation between an interviewer and a candidate.",
        actors: [
          { key: "interviewer", name: "Interviewer", order: 1 },
          { key: "candidate", name: "Candidate", order: 2 }
        ],
        lines: [
          { actorKey: "interviewer", text: "Good morning. Please have a seat.", order: 1 },
          { actorKey: "candidate", text: "Good morning. Thank you.", order: 2 },
          { actorKey: "interviewer", text: "How are you doing today?", order: 3 },
          { actorKey: "candidate", text: "I'm doing well, thank you for asking.", order: 4 },
          { actorKey: "interviewer", text: "Did you have any trouble finding the place?", order: 5 },
          { actorKey: "candidate", text: "No, everything was quite clear.", order: 6 },
          { actorKey: "interviewer", text: "Great. Let's get started.", order: 7 },
          { actorKey: "candidate", text: "Sure.", order: 8 },
          { actorKey: "interviewer", text: "Could you briefly introduce yourself?", order: 9 },
          { actorKey: "candidate", text: "My name is Alex, and I work as a software developer.", order: 10 },
          { actorKey: "interviewer", text: "How many years of experience do you have?", order: 11 },
          { actorKey: "candidate", text: "I have around three years of experience.", order: 12 },
          { actorKey: "interviewer", text: "What interests you about this role?", order: 13 },
          { actorKey: "candidate", text: "I'm interested in working on challenging real-world problems.", order: 14 },
          { actorKey: "interviewer", text: "That sounds good.", order: 15 },
          { actorKey: "candidate", text: "I'm excited to learn more about the team.", order: 16 },
          { actorKey: "interviewer", text: "We'll discuss that shortly.", order: 17 },
          { actorKey: "candidate", text: "Looking forward to it.", order: 18 },
          { actorKey: "interviewer", text: "Let's move on to the next question.", order: 19 },
          { actorKey: "candidate", text: "Alright.", order: 20 }
        ]
      },
      {
        title: "Project Discussion",
        description: "Discussing a past project during a professional interview.",
        actors: [
          { key: "interviewer", name: "Interviewer", order: 1 },
          { key: "candidate", name: "Candidate", order: 2 }
        ],
        lines: [
          { actorKey: "interviewer", text: "Can you describe a recent project you worked on?", order: 1 },
          { actorKey: "candidate", text: "Yes, I worked on a web application for internal use.", order: 2 },
          { actorKey: "interviewer", text: "What was the main goal of the project?", order: 3 },
          { actorKey: "candidate", text: "The goal was to improve workflow efficiency.", order: 4 },
          { actorKey: "interviewer", text: "What technologies did you use?", order: 5 },
          { actorKey: "candidate", text: "I used React, Node.js, and PostgreSQL.", order: 6 },
          { actorKey: "interviewer", text: "What was your role in the project?", order: 7 },
          { actorKey: "candidate", text: "I was responsible for both frontend and backend development.", order: 8 },
          { actorKey: "interviewer", text: "Did you face any challenges?", order: 9 },
          { actorKey: "candidate", text: "Yes, handling performance issues was challenging.", order: 10 },
          { actorKey: "interviewer", text: "How did you resolve them?", order: 11 },
          { actorKey: "candidate", text: "I optimized database queries and improved caching.", order: 12 },
          { actorKey: "interviewer", text: "What did you learn from this project?", order: 13 },
          { actorKey: "candidate", text: "I learned the importance of planning and testing.", order: 14 },
          { actorKey: "interviewer", text: "Would you do anything differently now?", order: 15 },
          { actorKey: "candidate", text: "I would involve stakeholders earlier.", order: 16 },
          { actorKey: "interviewer", text: "Good insight.", order: 17 },
          { actorKey: "candidate", text: "Thank you.", order: 18 },
          { actorKey: "interviewer", text: "Let's move on.", order: 19 },
          { actorKey: "candidate", text: "Sure.", order: 20 }
        ]
      },
      {
        title: "Job Interview – Behavioral Questions",
        description: "Answering behavioral questions during a job interview.",
        actors: [
          { key: "interviewer", name: "Interviewer", order: 1 },
          { key: "candidate", name: "Candidate", order: 2 }
        ],
        lines: [
          { actorKey: "interviewer", text: "I'd like to ask you some behavioral questions.", order: 1 },
          { actorKey: "candidate", text: "Sure.", order: 2 },
          { actorKey: "interviewer", text: "Can you describe a time you faced a challenge at work?", order: 3 },
          { actorKey: "candidate", text: "Yes, I once worked on a tight deadline.", order: 4 },
          { actorKey: "interviewer", text: "What made it challenging?", order: 5 },
          { actorKey: "candidate", text: "The requirements changed midway.", order: 6 },
          { actorKey: "interviewer", text: "How did you handle it?", order: 7 },
          { actorKey: "candidate", text: "I communicated clearly and adjusted priorities.", order: 8 },
          { actorKey: "interviewer", text: "What was the outcome?", order: 9 },
          { actorKey: "candidate", text: "We delivered the project successfully.", order: 10 },
          { actorKey: "interviewer", text: "What did you learn from that experience?", order: 11 },
          { actorKey: "candidate", text: "I learned to stay flexible and calm.", order: 12 },
          { actorKey: "interviewer", text: "Can you give another example?", order: 13 },
          { actorKey: "candidate", text: "I once resolved a conflict within my team.", order: 14 },
          { actorKey: "interviewer", text: "How did you approach it?", order: 15 },
          { actorKey: "candidate", text: "I listened carefully to both sides.", order: 16 },
          { actorKey: "interviewer", text: "And the result?", order: 17 },
          { actorKey: "candidate", text: "We reached a mutual understanding.", order: 18 },
          { actorKey: "interviewer", text: "That's good to hear.", order: 19 },
          { actorKey: "candidate", text: "Thank you.", order: 20 }
        ]
      },
      {
        title: "Team Meeting Discussion",
        description: "Participating in a team meeting and sharing updates.",
        actors: [
          { key: "manager", name: "Manager", order: 1 },
          { key: "employee", name: "Employee", order: 2 }
        ],
        lines: [
          { actorKey: "manager", text: "Let's begin the meeting.", order: 1 },
          { actorKey: "employee", text: "Sure.", order: 2 },
          { actorKey: "manager", text: "Can you give us an update on your task?", order: 3 },
          { actorKey: "employee", text: "Yes, I've completed most of the assigned work.", order: 4 },
          { actorKey: "manager", text: "What remains to be done?", order: 5 },
          { actorKey: "employee", text: "Some testing and final adjustments.", order: 6 },
          { actorKey: "manager", text: "Are there any blockers?", order: 7 },
          { actorKey: "employee", text: "No major issues at the moment.", order: 8 },
          { actorKey: "manager", text: "Do you need support from anyone?", order: 9 },
          { actorKey: "employee", text: "Not right now, but I will reach out if needed.", order: 10 },
          { actorKey: "manager", text: "Good. How is the timeline looking?", order: 11 },
          { actorKey: "employee", text: "We are on track to meet the deadline.", order: 12 },
          { actorKey: "manager", text: "That's good to hear.", order: 13 },
          { actorKey: "employee", text: "Yes, the team has been very supportive.", order: 14 },
          { actorKey: "manager", text: "Any suggestions for improvement?", order: 15 },
          { actorKey: "employee", text: "Better documentation could help.", order: 16 },
          { actorKey: "manager", text: "Noted. Thank you for sharing.", order: 17 },
          { actorKey: "employee", text: "You're welcome.", order: 18 },
          { actorKey: "manager", text: "Let's move to the next topic.", order: 19 },
          { actorKey: "employee", text: "Alright.", order: 20 }
        ]
      },
      {
        title: "Giving and Receiving Performance Feedback",
        description: "Discussing performance feedback in a professional setting.",
        actors: [
          { key: "manager", name: "Manager", order: 1 },
          { key: "employee", name: "Employee", order: 2 }
        ],
        lines: [
          { actorKey: "manager", text: "Thank you for meeting with me.", order: 1 },
          { actorKey: "employee", text: "Of course.", order: 2 },
          { actorKey: "manager", text: "I'd like to discuss your recent performance.", order: 3 },
          { actorKey: "employee", text: "Sure, I'm open to feedback.", order: 4 },
          { actorKey: "manager", text: "You've been consistent and reliable.", order: 5 },
          { actorKey: "employee", text: "Thank you, I appreciate that.", order: 6 },
          { actorKey: "manager", text: "There are a few areas we can improve.", order: 7 },
          { actorKey: "employee", text: "I'm happy to work on them.", order: 8 },
          { actorKey: "manager", text: "Communication could be more proactive.", order: 9 },
          { actorKey: "employee", text: "I understand and will focus on that.", order: 10 },
          { actorKey: "manager", text: "Do you have any feedback for me?", order: 11 },
          { actorKey: "employee", text: "Clearer priorities would be helpful.", order: 12 },
          { actorKey: "manager", text: "That's fair feedback.", order: 13 },
          { actorKey: "employee", text: "Thank you for listening.", order: 14 },
          { actorKey: "manager", text: "We'll review progress next month.", order: 15 },
          { actorKey: "employee", text: "Sounds good.", order: 16 },
          { actorKey: "manager", text: "Keep up the good work.", order: 17 },
          { actorKey: "employee", text: "I will.", order: 18 },
          { actorKey: "manager", text: "Thanks again for your time.", order: 19 },
          { actorKey: "employee", text: "Thank you.", order: 20 }
        ]
      },
      {
        title: "Client Communication & Clarification",
        description: "Clarifying requirements and expectations with a client.",
        actors: [
          { key: "client", name: "Client", order: 1 },
          { key: "professional", name: "Professional", order: 2 }
        ],
        lines: [
          { actorKey: "client", text: "Thank you for joining the call.", order: 1 },
          { actorKey: "professional", text: "Thank you for having me.", order: 2 },
          { actorKey: "client", text: "I wanted to clarify a few points.", order: 3 },
          { actorKey: "professional", text: "Of course, please go ahead.", order: 4 },
          { actorKey: "client", text: "Can you confirm the delivery timeline?", order: 5 },
          { actorKey: "professional", text: "The expected delivery is next Friday.", order: 6 },
          { actorKey: "client", text: "Does that include testing?", order: 7 },
          { actorKey: "professional", text: "Yes, testing is included.", order: 8 },
          { actorKey: "client", text: "What about future changes?", order: 9 },
          { actorKey: "professional", text: "Those can be handled as follow-up requests.", order: 10 },
          { actorKey: "client", text: "Will there be documentation?", order: 11 },
          { actorKey: "professional", text: "Yes, complete documentation will be provided.", order: 12 },
          { actorKey: "client", text: "That sounds good.", order: 13 },
          { actorKey: "professional", text: "Do you have any other questions?", order: 14 },
          { actorKey: "client", text: "No, that covers everything.", order: 15 },
          { actorKey: "professional", text: "Great. We'll proceed as discussed.", order: 16 },
          { actorKey: "client", text: "Thank you for the clarification.", order: 17 },
          { actorKey: "professional", text: "You're welcome.", order: 18 },
          { actorKey: "client", text: "Looking forward to the delivery.", order: 19 },
          { actorKey: "professional", text: "Likewise. Have a great day.", order: 20 }
        ]
      }

    ];

    for (const situation of situations) {
      await seedSituation(situation);
    }

    /* --------------------------------
       WRITE AUDIO MANIFEST
    --------------------------------- */
    const manifestPath = path.join(
      process.cwd(),
      "talkrehearsel-audio-manifest.json"
    );

    fs.writeFileSync(
      manifestPath,
      JSON.stringify(audioManifest, null, 2)
    );

    console.log("✅ TalkRehearsel seeding completed");
    console.log(`🎧 Audio manifest saved at: ${manifestPath}`);
  } catch (error) {
    console.error("❌ Failed to seed TalkRehearsel:", error);
  }
}
