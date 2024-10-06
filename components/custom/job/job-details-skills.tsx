import { Chip } from '@/components/ui/chip'

interface Props {
  job: Record<string, unknown>
}

export default function JobDetailsSkills({ job }: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold">Skills</h2>
      {!!(job.job_skills as Record<string, unknown>[]).length && (
        <ul className="flex gap-2 flex-wrap">
          {(job.job_skills as Record<string, unknown>[]).map(({ skills }) => (
            <li key={(skills as Record<string, unknown>).id as string}>
              <Chip
                contentClassName="max-w-[unset]"
                content={(skills as Record<string, unknown>).name as string}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
