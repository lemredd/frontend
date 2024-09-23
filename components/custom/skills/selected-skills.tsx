
import * as z from 'zod'
import { UseFormReturn } from "react-hook-form"

import CloseIcon from "@/public/svgs/close.svg"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { SkillsSchema } from "@/schemas"

interface Props<S = Record<string, string>> {
  form: UseFormReturn<z.infer<typeof SkillsSchema>>
  skills: S[]
}

export function SelectedSkills({ form, skills }: Props) {
  const selectedSkills = skills.filter(skill => form.watch("skillIds").includes(skill.id))
  function removeSkill(id: string) {
    form.setValue("skillIds", form.watch("skillIds").filter((skillId: string) => skillId !== id))
  }

  return (
    <Card className="shadow-none">
      <CardHeader><h3 className="text-lg">{selectedSkills.length} skills selected</h3></CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {selectedSkills.map(({ name, id }) => (
          <div key={id} className="rounded-full p-2 flex items-center gap-2 border border-slate-300" title={name}>
            <span className="text-sm max-w-[100px] truncate">{name}</span>
            <Button variant="destructive" size="icon" className="size-6 rounded-full"><CloseIcon onClick={() => removeSkill(id)} /></Button>
          </div>))}
      </CardContent>
    </Card>
  )
}
