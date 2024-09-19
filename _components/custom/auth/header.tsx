import { cn } from '@/_lib/utils'

interface HeaderProps {
  label: string
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn('text-3xl font-semibold')}> Authentication</h1>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}
