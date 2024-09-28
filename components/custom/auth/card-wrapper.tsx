'use client'

import { BackButton } from '@/components/custom/auth/back-button'
import { Header } from '@/components/custom/auth/header'
import { Social } from '@/components/custom/auth/social'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="z-10 w-11/12 max-w-[500px] shadow-md !glass border-0 p-3">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter className="flex flex-col space-y-4 ">
          <div className="relative w-full ">
            <div className="absolute inset-0 flex items-center justify-between">
              <span className="w-1/5 sm:w-1/4 md:w-1/3 border-t border-gray-300" />
              <span className="w-1/5 sm:w-1/4 md:w-1/3 border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className=" px-2 bg-glass text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  )
}
