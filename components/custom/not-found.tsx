import { cn } from '@/lib/utils'
import NotFoundSVG from '@/public/svgs/not-found.svg'

const NotFound = ({ className }: { className?: string }) => {
  return <NotFoundSVG className={cn('min-h-48', className)} />
}

export default NotFound
