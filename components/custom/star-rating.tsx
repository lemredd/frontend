import { FormLabel } from '@/components/ui/form'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  hoverValue: number | null
  onChange: (value: number) => void
  onMouseEnter: (value: number) => void
  onMouseLeave: () => void
}

function StarRating({
  value,
  hoverValue,
  onChange,
  onMouseEnter,
  onMouseLeave,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center">
      {stars.map((_, index) => {
        const currentValue = index + 1
        const isHovered = hoverValue !== null
        const activeValue = isHovered ? hoverValue : value
        const fillPercentage = Math.min(
          100,
          Math.max(0, (activeValue - index) * 100),
        )

        return (
          <FormLabel
            key={index}
            className="relative cursor-pointer"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const hoverPosition = e.clientX - rect.left
              const starWidth = rect.width
              const isHalf = hoverPosition < starWidth / 2
              onMouseEnter(isHalf ? currentValue - 0.5 : currentValue)
            }}
            onMouseLeave={onMouseLeave}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const clickPosition = e.clientX - rect.left
              const starWidth = rect.width
              const isHalf = clickPosition < starWidth / 2
              onChange(isHalf ? currentValue - 0.5 : currentValue)
            }}
          >
            {/* Background Star (Unfilled) */}
            <Star
              size={32}
              className="fill-gray-300"
            />

            {/* Filled Star */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{
                width: `${fillPercentage}%`,
              }}
            >
              <Star
                size={32}
                className="fill-yellow-500"
              />
            </div>
          </FormLabel>
        )
      })}
    </div>
  )
}

export default StarRating
