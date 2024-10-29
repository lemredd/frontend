import { createClient } from '@/utils/supabase/client'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  profile: Record<string, any> | null
}

// TODO: get rating from profile
export function ProfileRating({ profile }: Props) {
  const supabase = createClient()
  const [avgRating, setAvgRating] = useState(0)

  useEffect(() => {
    if (!profile) return

    supabase
      .rpc('get_avg_rate', { profile_id: profile.id })
      .then(({ data, error }) => {
        if (error) return console.error(error)
        setAvgRating(data)
      })
  }, [profile, supabase])

  return (
    <div className="flex items-center gap-x-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={
            avgRating >= i ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
          }
        />
      ))}
      <span className="text-lg font-semibold text-gray-600">{avgRating}</span>
    </div>
  )
}
