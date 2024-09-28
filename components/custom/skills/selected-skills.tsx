
import * as z from 'zod'
import { UseFormReturn } from "react-hook-form"

import CloseIcon from "@/public/svgs/close.svg"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { SkillsSchema } from "@/schemas"
import { Chip } from '@/components/ui/chip'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Props {
  form: UseFormReturn<z.infer<typeof SkillsSchema>>
}

export function SelectedSkills({ form }: Props) {
  const supabase = createClient()
  const [selectedSkills, setSelectedSkills] = useState<Record<string, string>[]>([])
  function removeSkill(id: string) {
    form.setValue("skillIds", form.watch("skillIds").filter((skillId: string) => skillId !== id))
  }

  useEffect(() => {
    const subscription = form.watch(({ skillIds }) => {
      if (!skillIds) return

      supabase
        .from('skills')
        .select('id,name')
        .in('id', skillIds)
        .then(({ data }) => {
          setSelectedSkills(data!)
        })
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch])

  return (
    <Card className="shadow-none">
      <CardHeader><h3 className="text-lg">{selectedSkills.length} skills selected</h3></CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {!!selectedSkills.length && selectedSkills.map(({ name, id }) => (
          <Chip
            key={id}
            content={name}
            afterContent={(
              <Button variant="destructive" size="icon" className="size-6 rounded-full">
                <CloseIcon onClick={() => removeSkill(id)} />
              </Button>
            )}
          />
        ))}
      </CardContent>
    </Card>
  )
}
