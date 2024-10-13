import { create } from 'zustand'

interface JobState<T = Record<string, any>> {
  job?: T
  isOwned: boolean
  isEditing: boolean
  setEditing: (isEditing: boolean) => void
  setJob: (job: T, isOwned: boolean) => void
  isJobOpen: () => boolean
}

export const useJobStore = create<JobState>()((set, get) => ({
  job: undefined,
  isOwned: false,
  isEditing: false,
  setJob: (job, isOwned) => set({ job, isOwned }),
  isJobOpen: () => get().job?.status === 'open',
  setEditing: (isEditing) => set({ isEditing }),
}))
