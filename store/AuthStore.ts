
import { fetchProfile } from '@/actions/fetchProfile'
import { login } from '@/actions/login'
import { logout } from '@/actions/logout'
import { resendEmail } from '@/actions/resend'
import { refreshUser } from '@/actions/user'
import { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Profile extends Record<string, any> {
  id: string
  user_id: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  role_code: 'SKR' | 'PDR' | 'ADMIN' | undefined
  isAuthenticated: boolean
  isLoading: boolean
  login: (values: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  resend: (email: string) => Promise<void>
  setIsLoading: (isLoading: boolean) => void
  setUser: (user: any) => void
  refreshUser: () => void
  setProfile: (profile: Profile | null) => void
  setRoleCode: (role_code: 'SKR' | 'PDR' | 'ADMIN' | undefined) => void
  refetchProfile: (user_id: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      role_code: undefined,
      isAuthenticated: false,
      isLoading: true,
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      refreshUser: () => {
        refreshUser().then(({ user }) =>
          set({ user, isAuthenticated: !!user }))
      },
      setProfile: (profile) => set({ profile }),
      setRoleCode: (role_code: 'SKR' | 'PDR' | 'ADMIN' | undefined) =>
        set({ role_code }),
      login: async (values: { email: string; password: string }) => {
        const response = await login(values)

        if (response.error) {
          const { error } = await response
          throw new Error(error)
        }

        const { data } = await response
        const user = data?.user

        set({
          user,
          profile: data?.profile as Profile,
          role_code: user?.user_metadata?.role_code || undefined,
          isAuthenticated: true,
        })
      },
      logout: async () => {
        const response = await logout()

        if (response.error) {
          const { error } = await response
          throw new Error(error)
        }

        set({
          user: null,
          profile: null,
          role_code: undefined,
          isAuthenticated: false,
        })
      },
      resend: async (email: string) => {
        const response = await resendEmail(email)

        if (response.error) {
          const { error } = await response
          throw new Error(error)
        }
      },
      refetchProfile: async (user_id: string) => {
        const response = await fetchProfile(user_id)

        if (response.error) {
          const { error } = await response
          throw new Error(error)
        }

        const { data } = await response

        set({
          profile: data as Profile,
        })
      },
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false)
      },
    },
  ),
)
