import JobList from "@/components/custom/job/job-list"
import { ProviderHeader as Header } from "@/components/custom/job/job-list-header"

export default function TaskListPage() {
  return (
    <section className="space-y-4">
      <Header />

      <JobList />
    </section>
  )
}
