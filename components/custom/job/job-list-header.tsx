'use client'

import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const PROVIDER_STATUSES = ['open', 'ongoing', 'completed', 'closed']
const SEEKER_STATUSES = ['pending', 'ongoing', 'completed', 'declined']

export function ProviderHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { value } = e.currentTarget.search

    const newSearchParams = new URLSearchParams(searchParams.toString())

    if (!value) newSearchParams.delete('search')
    else newSearchParams.set('search', value)

    router.push(`./?${newSearchParams.toString()}`)
  }

  function buildLink(status: string) {
    let to = `./?status=${status}`
    if (searchParams.get('search'))
      to += `&search=${searchParams.get('search')}`
    return to
  }

  return (
    <>
      <header className="flex items-center justify-between w-full mx-auto">
        <h2 className="text-2xl font-extrabold">Tasks</h2>
        <Button asChild>
          <Link
            className="flex gap-x-2"
            href="post"
          >
            <Plus />
            Add Task
          </Link>
        </Button>
      </header>
      <section className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4  mx-auto">
        <Tabs
          defaultValue={searchParams.get('status') ?? 'open'}
          className="w-full md:max-w-[400px]"
        >
          <TabsList className="w-full">
            {PROVIDER_STATUSES.map((status) => (
              <TabsTrigger
                className="flex-grow"
                key={status}
                value={status}
                asChild
              >
                <Link href={buildLink(status)}>
                  <span className="capitalize">{status}</span>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <form
          className="flex items-center max-w-xl"
          onSubmit={search}
        >
          <div className="flex-grow flex items-center border border-r-0 rounded-l-md py-2 px-4 gap-x-2">
            <Search />
            <input
              defaultValue={searchParams.get('search') ?? ''}
              name="search"
              className="focus:ring-0 focus:outline-none w-full bg-transparent"
            />
          </div>
          <div className="border border-primary rounded-r-md bg-blue-primary">
            <Button
              size="lg"
              className=" border border-blue-primary"
            >
              Search
            </Button>
          </div>
        </form>
      </section>
    </>
  )
}

export function SeekerHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { value } = e.currentTarget.search

    const newSearchParams = new URLSearchParams(searchParams.toString())

    if (!value) newSearchParams.delete('search')
    else newSearchParams.set('search', value)

    router.push(`/?${newSearchParams.toString()}`)
  }

  function buildLink(status: string) {
    let to = `/?status=${status}`
    if (searchParams.get('search'))
      to += `&search=${searchParams.get('search')}`
    return to
  }

  return (
    <>
      <header className="flex items-center justify-between w-full mx-auto">
        <h2 className="text-2xl font-extrabold">Tasks</h2>
      </header>
      <section className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4  mx-auto">
        <Tabs
          defaultValue={searchParams.get('status') ?? 'pending'}
          className="w-full md:max-w-[400px]"
        >
          <TabsList className="w-full">
            {SEEKER_STATUSES.map((status) => (
              <TabsTrigger
                className="flex-grow"
                key={status}
                value={status}
                asChild
              >
                <Link href={buildLink(status)}>
                  <span className="capitalize">{status}</span>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <form
          className="flex items-center max-w-xl"
          onSubmit={search}
        >
          <div className="flex-grow flex items-center border border-r-0 rounded-l-md py-2 px-4 gap-x-2">
            <Search />
            <input
              defaultValue={searchParams.get('search') ?? ''}
              name="search"
              className="focus:ring-0 focus:outline-none w-full bg-transparent"
            />
          </div>
          <div className="border border-primary rounded-r-md bg-blue-primary">
            <Button
              size="lg"
              className=" border border-blue-primary"
            >
              Search
            </Button>
          </div>
        </form>
      </section>
    </>
  )
}
