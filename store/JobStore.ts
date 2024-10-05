import { create } from 'zustand'

interface JobState {
  job?: Record<string, unknown>
  isOwned: boolean
  setJob: (job: Record<string, unknown>, isOwned: boolean) => void
  isJobOpen: () => boolean
}

export const useJobStore = create<JobState>()(
  (set, get) => ({
    job: undefined,
    isOwned: false,
    setJob: (job, isOwned) => set({ job, isOwned }),
    isJobOpen: () => get().job?.status === 'open',
  }),
)
