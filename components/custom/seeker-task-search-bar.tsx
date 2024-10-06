'use client'

import { Button } from '@/components/ui/button'
import { MapPin, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SeekerTaskSearchBar() {
  const searchParams = useSearchParams()
  const router = useRouter()

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    let to = '/skr/tasks?'
    if (formData.get('search')) to += `&search=${formData.get('search')}`
    if (formData.get('location')) to += `&location=${formData.get('location')}`
    router.push(to)
  }

  return (
    <form
      className="w-full flex flex-col md:flex-row items-center justify-center gap-y-2"
      onSubmit={search}
    >
      <div className="flex items-center border md:border-r-0 md:rounded-l-md py-2 px-4 gap-x-2 w-full sm:w-auto">
        <Search />
        <input
          defaultValue={searchParams.get('search') ?? ''}
          name="search"
          placeholder="Search tasks"
          className="focus:ring-0 focus:outline-none w-full bg-transparent"
        />
      </div>
      <div className="flex items-center border md:border-r-0 py-2 px-4 gap-x-2 w-full sm:w-auto">
        <MapPin />
        <input
          defaultValue={searchParams.get('location') ?? ''}
          name="location"
          placeholder="Location"
          className="focus:ring-0 focus:outline-none w-full bg-transparent"
        />
      </div>

      <Button
        size="lg"
        className="md:rounded-[unset] md:rounded-r-md w-full sm:w-auto"
      >
        Search
      </Button>
    </form>
  )
}
