import { Search, Locate } from "lucide-react"
import { Input } from "@/components/ui/input";

export default function SeekerTaskSearchBar() {
  return (
    // TODO: use form to submit
    <div className="flex items-center">
      <Search />
      <Input className="focus:outline-none" />
    </div>
  )
}
