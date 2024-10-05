import { cn } from "@/lib/utils"

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  beforeContent?: React.ReactNode,
  afterContent?: React.ReactNode,
  contentClassName?: React.HTMLAttributes<HTMLSpanElement>["className"]
}
export function Chip({ className, contentClassName, beforeContent, content, afterContent }: ChipProps) {
  return (
    <div
      className={cn(
        "rounded-full px-3 py-1 flex items-center gap-2 border border-slate-300",
        className
      )}
      title={content}
    >
      {beforeContent}
      <span className={cn(
        "text-sm max-w-[100px] truncate",
        contentClassName
      )}>{content}</span>
      {afterContent}
    </div>
  )
}
