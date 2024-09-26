import { RegisterForm } from '@/components/custom/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="relative w-full min-h-screen  bg-[url('/images/hero.png')] bg-cover bg-center bg-no-repeat ">
      <div className="h-full bg-background/70 dark:bg-background/50 absolute inset-0" />
      <div className="flex items-center justify-center pt-40 pb-20  min-h-screen w-full">
        <RegisterForm />
      </div>
    </div>
  )
}
