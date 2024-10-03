import { create } from 'zustand'

interface JobState {
  job?: Record<string, unknown>
  isOwned: boolean
  setJob: (job: Record<string, unknown>, isOwned: boolean) => void
}

export const useJobStore = create<JobState>()(
  (set) => ({
    job: undefined,
    isOwned: false,
    setJob: (job, isOwned) => set({ job, isOwned })
  }),
)
