import { cn } from '@/lib/utils'

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  getStatusColor?: boolean
  beforeContent?: React.ReactNode
  afterContent?: React.ReactNode
  contentClassName?: React.HTMLAttributes<HTMLSpanElement>['className']
}

const statusColors: { [key: string]: string } = {
  completed: 'bg-green-100 text-green-800 border-green-300',
  ongoing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  open: 'bg-blue-100 text-blue-800 border-blue-300',
  close: 'bg-red-100 text-red-800 border-red-300',
  pending: 'bg-yellow-300 text-yellow-800',
  accepted: 'bg-green-300 text-green-800',
  declined: 'bg-red-300 text-red-800',
}
export function Chip({
  className,
  contentClassName,
  getStatusColor = false,
  beforeContent,
  content,
  afterContent,
}: ChipProps) {
  return (
    <div
      className={cn(
        'rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 flex items-center gap-1.5 border  flex-wrap max-w-full',
        getStatusColor &&
          statusColors[content.toLowerCase() as keyof typeof statusColors],
        className,
      )}
      title={content}
    >
      {beforeContent}
      <span
        className={cn('text-[10px] sm:text-xs break-words', contentClassName)}
      >
        {content}
      </span>
      {afterContent}
    </div>
  )
}
