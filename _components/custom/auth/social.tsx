'use client'
import { Button } from '@/_components/ui/button'
import { FcGoogle } from 'react-icons/fc'
export const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-4">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => console.log('clicked')}
      >
        <FcGoogle className="size-5" />
      </Button>
    </div>
  )
}
