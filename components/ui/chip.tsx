import { cn } from '@/lib/utils'

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  beforeContent?: React.ReactNode
  afterContent?: React.ReactNode
  contentClassName?: React.HTMLAttributes<HTMLSpanElement>['className']
}

export function Chip({
  className,
  contentClassName,
  beforeContent,
  content,
  afterContent,
}: ChipProps) {
  return (
    <div
      className={cn(
        'rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 flex items-center gap-1.5 border border-slate-300 flex-wrap max-w-full',
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
