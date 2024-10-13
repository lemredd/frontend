import { Star } from "lucide-react";

interface Props {
  profile: Record<string, any>;
}

// TODO: get rating from profile
export function ProfileRating({ profile: _ }: Props) {
  return (
    <div className="flex items-center gap-x-2">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} />
      ))}
      <span>0.0</span>
    </div>
  )
}
