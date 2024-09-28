interface ChipProps {
  content: string
  afterContent: React.ReactNode
}
export function Chip({ content, afterContent }: ChipProps) {
  return (
    <div
      className="rounded-full px-3 py-1 flex items-center gap-2 border border-slate-300"
      title={content}
    >
      <span className="text-sm max-w-[100px] truncate">{content}</span>
      {afterContent}
    </div>
  )
}
