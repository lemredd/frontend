'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/AuthStore'
import { useRouter } from 'next/navigation'

const Logout = () => {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    await logout()
      .then(() => {
        router.push('/auth/login')
      })
      .catch((error: any) => {
        //  if (error) setError(error.message)
        console.log(error)
      })
  }

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      className="w-full"
    >
      Logout
    </Button>
  )
}

export default Logout
