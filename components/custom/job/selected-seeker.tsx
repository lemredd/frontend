import { ApplicantListItem } from "./applicant-list-item"

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicant?: Record<string, any>
}
export function SelectedSeeker({ applicant }: Props) {
  if (!applicant) return null

  return (
    <>
      <h2 className="text-xl">Selected Seeker</h2>
      <ApplicantListItem applicant={applicant} />
    </>
  )
}
