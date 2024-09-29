"use client"

import { Search, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

export default function SeekerTaskSearchBar() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Not using `react-hook-form` for simplicity
  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    let to = "/skr/tasks?"
    if (formData.get("search")) to += `&search=${formData.get("search")}`
    if (formData.get("location")) to += `&location=${formData.get("location")}`
    router.push(to)
  }

  return (
    <form className="w-max mx-auto flex items-center" onSubmit={search}>
      <div className="flex items-center border border-r-0 rounded-l-md py-2 px-4 gap-x-2">
        <Search />
        <input defaultValue={searchParams.get("search") ?? ""} name="search" className="focus:ring-0 focus:outline-none w-full bg-transparent" />
      </div>
      <div className="flex items-center border border-r-0 py-2 px-4 gap-x-2">
        <MapPin />
        <input defaultValue={searchParams.get("location") ?? ""} name="location" className="focus:ring-0 focus:outline-none w-full bg-transparent" />
      </div>
      <div className="border border-primary rounded-r-md bg-blue-primary">
        <Button size="lg" className=" border border-blue-primary">Search</Button>
      </div>
    </form>
  )
}
