import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Frown } from 'lucide-react'

interface EmptyStateProps {
  message: string
  actionLabel?: string
  onActionClick?: () => void
  icon?: JSX.Element
  subtitle?: string
}

export default function EmptyState({
  message,
  actionLabel,
  onActionClick,
  icon = <Frown className="text-muted-foreground w-16 h-16" />, // Uses muted foreground for theme adaptability
  subtitle,
}: EmptyStateProps) {
  return (
    <Card className="text-center py-8 px-4 bg-card rounded-lg shadow-md">
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-center p-4 bg-muted rounded-full">
          {icon}
        </div>
        <p className="text-card-foreground font-medium">{message}</p>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
        {actionLabel && onActionClick && (
          <Button
            onClick={onActionClick}
            variant="outline"
            className="mt-2"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
