import { login } from '@/actions/login'
import { logout } from '@/actions/logout'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: any | null
  role_code: 'SKR' | 'PDR' | 'ADMIN' | undefined
  isAuthenticated: boolean
  isLoading: boolean
  login: (values: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  setIsLoading: (isLoading: boolean) => void
  setUser: (user: any) => void
  setRoleCode: (role_code: 'SKR' | 'PDR' | 'ADMIN' | undefined) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role_code: undefined,
      isAuthenticated: false,
      isLoading: true,
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
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
          role_code: undefined,
          isAuthenticated: false,
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
