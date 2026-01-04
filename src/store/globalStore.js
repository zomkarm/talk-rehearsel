// stores/global.js
import { create } from 'zustand'

export const useGlobalStore = create((set) => ({
  isLoading: false,
  loaderMessage: "Loading...",
  isLoggedIn: false,
  isPageTutorRightClickEnabled: false,
  pageTutorGuestStepLimit: 100,
  pageTutorFreeStepLimit: 1000,

  isSemanticBuilderRightClickEnabled: false,

  showLoader: (message = "Loading...") => 
    set({ isLoading: true, loaderMessage: message }),
  hideLoader: () => 
    set({ isLoading: false, loaderMessage: "Loading..." }),
  
  // Setter for manual updates
  setLoggedIn: (status) => set({ isLoggedIn: status }),

  // Method to fetch user status
  fetchUserStatus: async () => {
    try {
      const res = await fetch('/api/user/status')
      const data = await res.json()
      set({ isLoggedIn: data.loggedIn })
    } catch (err) {
      console.error('Error fetching user status:', err)
      set({ isLoggedIn: false })
    }
  },
}))
