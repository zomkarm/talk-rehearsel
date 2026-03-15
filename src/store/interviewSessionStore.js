import { create } from 'zustand'

export const useInterviewSessionStore = create((set) => ({

  sessionInterviewId: null,
  sessionQuestions: [],
  sessionMode: 'chill',
  sessionTimer: 0,

  sessionCurrentIndex: 0,
  sessionStarted: false,
  sessionCompleted: false,

  setSessionInterviewId: (id) =>
    set({ sessionInterviewId: id }),

  setSessionQuestions: (questions) =>
    set({ sessionQuestions: questions }),

  setSessionMode: (mode) =>
    set({ sessionMode: mode }),

  setSessionTimer: (timer) =>
    set({ sessionTimer: timer }),

  startSession: () =>
    set({ sessionStarted: true }),

  nextSessionQuestion: () =>
    set((state) => {

      const nextIndex = state.sessionCurrentIndex + 1

      if (nextIndex >= state.sessionQuestions.length) {
        return {
          sessionCompleted: true
        }
      }

      return {
        sessionCurrentIndex: nextIndex
      }

    }),

  resetSession: () =>
    set({
      sessionInterviewId: null,
      sessionQuestions: [],
      sessionMode: 'chill',
      sessionTimer: 0,
      sessionCurrentIndex: 0,
      sessionStarted: false,
      sessionCompleted: false
    })

}))