import { JobForm } from "@/components/custom/job/job-form";

export default function PostTaskPage() {
  return (
    <main className="container mx-auto flex h-full flex-col justify-center">
      <h1 className="text-3xl">Tell us what needs to be <strong>done.</strong></h1>
      <p>{"We'll"} guide you to create the perfect brief. The more detail the better.</p>

      <JobForm />
    </main>
  )
}
