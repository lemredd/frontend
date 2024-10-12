import { cn } from '@/lib/utils'

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  getStatusColor?: boolean
  beforeContent?: React.ReactNode
  afterContent?: React.ReactNode
  contentClassName?: React.HTMLAttributes<HTMLSpanElement>['className']
}

const statusColors: { [key: string]: string } = {
  open: 'bg-green-100 text-green-800 border-green-300',
  ongoing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
  close: 'bg-red-100 text-red-800 border-red-300',
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
        'rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 flex items-center gap-1.5 border border-foreground flex-wrap max-w-full',
        getStatusColor && statusColors[content as keyof typeof statusColors],
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
