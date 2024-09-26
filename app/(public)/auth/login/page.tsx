import { LoginForm } from '@/components/custom/auth/login-form'

export default function JoinPage() {
  return (
    <div className="relative w-full min-h-screen bg-[url('/images/hero.png')] bg-cover bg-center bg-no-repeat ">
      <div className="bg-background/70 dark:bg-background/50 absolute inset-0" />
      <div className="flex items-center justify-center pt-40 pb-20 min-h-screen w-full">
        <LoginForm />
      </div>
    </div>
  )
}
