import { User } from "@supabase/supabase-js"
import { Phone, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/AuthStore"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const VERIFICATIONS = [
  {
    name: "Phone",
    icon: Phone,
    check: (user: User | null) => !!user && !!user.phone && !!user.phone_confirmed_at,
    get: (user: User | null) => user?.phone || "Unverified",
  },
  {
    name: "Email",
    icon: Mail,
    check: (user: User | null) => !!user && !!user.email && !!user.email_confirmed_at,
    get: (user: User | null) => user?.email || "Unverified",
  },
]

export function VerificationList() {
  const { user } = useAuthStore()

  return (
    <Card className="row-span-4 h-max">
      <CardHeader>
        <h3>Verifications</h3>
      </CardHeader>
      <CardContent>
        <ul className="flex gap-x-2 items-center">
          {VERIFICATIONS.map(verification => (
            <li key={verification.name as string}>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <verification.icon color={verification.check(user) ? "green" : "gray"} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {verification.get(user)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
