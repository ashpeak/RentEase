import { create } from 'zustand'

interface Profile {
  name: string
  email: string
  phone?: string
  location?: string
  bio?: string
  profileImage?: string
  coverPhoto?: string
  memberSince: string
  responseRate?: string
  responseTime?: string
  verifications: {
    email?: boolean
    phone: boolean
    government: boolean
    facebook: boolean
    google: boolean
  }
  reviews: Array<{
    type: 'asRenter' | 'asOwner'
    reviewer: {
      name: string
      avatar?: string
      initials: string
    }
    rating: number
    date: string
    comment: string
    product: string
  }>
  reviewsSummary: {
    asRenter: {
      count: number
      average: number
    }
    asOwner: {
      count: number
      average: number
    }
  }
  createdAt: string | Date  // Updated to handle both string and Date
}

interface UserStore {
  profile: Profile | null
  preferences: {
    currency: string
    language: string
    notifications: {
      email: boolean
      push: boolean
      marketing: boolean
    }
  }
  setProfile: (profile: Profile) => void
  updateProfile: (updates: Partial<Profile>) => void
  updatePreferences: (updates: Partial<UserStore['preferences']>) => void
  clearProfile: () => void
}

const defaultPreferences = {
  currency: 'INR',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    marketing: false
  }
}

// Simple store without persistence to avoid SSR issues
export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  preferences: defaultPreferences,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) => 
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null
    })),
  updatePreferences: (updates) =>
    set((state) => ({
      preferences: { ...state.preferences, ...updates }
    })),
  clearProfile: () => set({ profile: null })
}))