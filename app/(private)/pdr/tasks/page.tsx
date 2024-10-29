import JobList from '@/components/custom/job/job-list'
import { ProviderHeader as Header } from '@/components/custom/job/job-list-header'

export default function TaskListPage() {
  return (
    <>
      <Header />

      <JobList role="provider" />
    </>
  )
}
