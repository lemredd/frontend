import { ProfileJobList } from '@/components/custom/job/job-list'
import { SeekerHeader } from '@/components/custom/job/job-list-header'

// import Image from 'next/image'
export default function Dashboard() {
  return (
    <>
      <SeekerHeader />
      <ProfileJobList role="seeker" />
    </>
  )
}
