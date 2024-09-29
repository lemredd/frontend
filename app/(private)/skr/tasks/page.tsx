"use client"

import JobList from "@/components/custom/job/job-list";
import SeekerTaskSearchBar from "@/components/custom/seeker-task-search-bar";

export default function SeekerTasksPage() {
  return (
    <section className="space-y-8">
      <SeekerTaskSearchBar />
      <JobList />
    </section>
  )
}
