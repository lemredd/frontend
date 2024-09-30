"use client"

import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const STATUSES = ["open", "ongoing", "completed", "closed"]

export function ProviderHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { value } = e.currentTarget.search

    router.push(`./?${searchParams.toString()}&search=${value}`)
  }

  function buildLink(status: string) {
    let to = `./?status=${status}`
    if (searchParams.get("search")) to += `&search=${searchParams.get("search")}`
    return to
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <h2 className="text-2xl">Tasks</h2>
        <Button asChild>
          <Link className="flex gap-x-2" href="post">
            <Plus />
            Add Task
          </Link>
        </Button>
      </header>
      <section className="space-y-4">
        <Tabs defaultValue={searchParams.get("status") ?? "open"} className="w-[400px]">
          <TabsList>
            {STATUSES.map(status => (
              <TabsTrigger key={status} value={status} asChild>
                <Link href={buildLink(status)}>
                  <span className="capitalize">{status}</span>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <form className="flex items-center w-full" onSubmit={search}>
          <div className="flex-grow flex items-center border border-r-0 rounded-l-md py-2 px-4 gap-x-2">
            <Search />
            <input defaultValue={searchParams.get("search") ?? ""} name="search" className="focus:ring-0 focus:outline-none w-full bg-transparent" />
          </div>
          <div className="border border-primary rounded-r-md bg-blue-primary">
            <Button size="lg" className=" border border-blue-primary">Search</Button>
          </div>
        </form>
      </section>
    </>
  )
}
