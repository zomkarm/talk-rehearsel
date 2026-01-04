# TalkRehearsel

TalkRehearsel is a focused communication practice utility designed to help users rehearse real-world conversations through guided scenarios, structured dialogue, and accent-based audio playback.

It is built as a **single-flow practice tool**, not a dashboard-heavy application.

---

## What TalkRehearsel Solves

Most communication tools are either:
- too generic, or
- too AI-heavy, or
- disconnected from real conversational structure

TalkRehearsel focuses on **intentional practice** by letting users rehearse predefined, realistic conversations line by line.

Examples:
- Interview conversations
- Professional discussions
- Social or casual scenarios

---

## Core Concept

A **situation** consists of:
- two actors
- ordered dialogue lines
- pre-generated system voices
- user-recorded responses

Users can:
1. Listen to the full conversation
2. Choose one actor’s role
3. Practice speaking their part while the system plays the other actor

---

## Key Features

- Situation-based conversation practice
- Line-by-line guided dialogue
- Accent-based system voices (IN / US / UK)
- User voice recording per line
- Retry, overwrite, and restart practice sessions
- Works without login (limited)
- Saves progress for logged-in users

No scoring.  
No AI grading.  
Just structured rehearsal.

---

## User Flow

1. Select a situation
2. Select an accent
3. Choose a mode:
   - View (listen + read)
   - Practice (speak + record)
4. Practice the conversation line by line
5. Retry or restart as needed

All actions happen on a **single unified practice surface**.

---

## Authentication Behavior

### Guest Users
- Can try predefined demo situations
- Recordings exist only locally
- No history or persistence

### Logged-In Users
- Recordings are saved
- Can retry and overwrite recordings
- Resume practice from dashboard home

---

## Architecture Overview

TalkRehearsel is built as a **module on top of Keystone**.

- Keystone provides:
  - authentication
  - layouts
  - dashboards
  - admin tooling

- TalkRehearsel provides:
  - domain logic
  - practice flow
  - conversation data model

The module remains isolated from Keystone core.

---

## Tech Stack

- Next.js (App Router)
- PostgreSQL
- Prisma
- Tailwind CSS
- Web Audio APIs

---

## Database Model (High Level)

- Situation
- Actor
- Line
- LineVoice
- Recording

The schema is designed for:
- deterministic playback
- simple querying
- clean extensibility

---

## Design Philosophy

- Single-page practice flow
- Minimal navigation
- Session logic handled in application state
- Database kept intentionally simple
- Utility-first over feature-heavy

TalkRehearsel prioritizes **comfort, repetition, and focus**.

---

## Use Cases

- Interview preparation
- Communication confidence building
- Accent familiarity
- Daily speaking practice

---

## Status

TalkRehearsel is an active learning and practice project.
It is intentionally scoped for usability over completeness.

Future enhancements may be added based on real usage.

---

## License

Currently intended for personal and internal use.
Licensing may be updated if shared publicly.
