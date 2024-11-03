'use client'

import JobList from '@/components/custom/job/job-list'
import SeekerTaskSearchBar from '@/components/custom/seeker-task-search-bar'

export default function SeekerTasksPage() {
  return (
    <>
      <SeekerTaskSearchBar />
      <JobList role="seeker" />
    </>
  )
}
