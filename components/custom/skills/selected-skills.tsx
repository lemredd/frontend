
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
      <CardContent>
        {selectedSkills.map(({ name, id }) => (
          <div key={id} className="flex items-center justify-between">
            <span>{name}</span>
            <Button variant="destructive"><CloseIcon onClick={() => removeSkill(id)} /></Button>
          </div>))}
      </CardContent>
    </Card>
  )
}
