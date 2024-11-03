import { JobForm } from '@/components/custom/job/job-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function PostTaskPage() {
  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="text-3xl">
          Tell us what needs to be <strong>done.</strong>
        </CardTitle>
        <CardDescription>
          {"We'll"} guide you to create the perfect brief. The more detail the
          better.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <JobForm />
      </CardContent>
    </Card>
  )
}
