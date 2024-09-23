'use client'

import { Button } from '@/components/ui/button'

const Logout = () => {
  // Client-side logout function
  const handleLogout = async () => {}

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
    >
      Logout
    </Button>
  )
}

export default Logout
