import { Chip } from '@/components/ui/chip'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuthStore } from '@/store/AuthStore'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'

interface Props {
  job: Record<string, unknown>
}

export default function JobDetailsSkills({ job }: Props) {
  const { user, profile } = useAuthStore()

  function matchProfileSkills(skill: Record<string, unknown>): string | undefined {
    if (user?.user_metadata.role_code !== "SKR") return undefined

    if (profile?.profile_skills.some((profileSkill: Record<string, any>) => profileSkill.skills.id === skill.id))
      return "bg-green-500 text-white"

    return undefined
  }

  return (
    <>
      <h2 className="text-lg font-semibold flex items-center gap-x-2">
        Skills
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <QuestionMarkCircledIcon />
            </TooltipTrigger>
            <TooltipContent>Skills matching yours are marked as green</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h2>
      {!!(job.job_skills as Record<string, unknown>[]).length && (
        <ul className="flex gap-2 flex-wrap">
          {(job.job_skills as Record<string, unknown>[]).map(({ skills }) => (
            <li key={(skills as Record<string, unknown>).id as string}>
              <Chip
                contentClassName="max-w-[unset]"
                className={matchProfileSkills(skills as Record<string, unknown>)}
                content={(skills as Record<string, unknown>).name as string}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
