import { useEffect, useState } from 'react'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'
import * as z from 'zod'

import Spinner from '@/components/custom/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { SkillsSchema } from '@/lib/schema'
import { createClient } from '@/utils/supabase/client'

interface Props<S = Record<string, string>> {
  selectedCategory: string
  form: UseFormReturn<z.infer<typeof SkillsSchema>>
  skills: S[]
  setSkills: React.Dispatch<React.SetStateAction<S[]>>
  onSubmit: () => void
}

export function SkillsForm({
  selectedCategory,
  form,
  skills,
  setSkills,
  onSubmit,
}: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!selectedCategory) return

    setLoading(true)

    supabase
      .from('skills')
      .select('id,name')
      .eq('skill_category_id', selectedCategory)
      .then(({ data }) => {
        setSkills(data!)
        setLoading(false)
      })
  }, [selectedCategory])

  function addSkill(
    field: ControllerRenderProps<z.infer<typeof SkillsSchema>>,
    skill: Record<string, string>,
  ) {
    field.onChange([...field.value, skill.id])
  }

  function removeSkill(
    field: ControllerRenderProps<z.infer<typeof SkillsSchema>>,
    skill: Record<string, string>,
  ) {
    field.onChange(
      (field.value as string[]).filter((id: string) => id !== skill.id),
    )
  }

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-lg">2. Select skills</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form
          id="skills-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <CardContent className="space-y-4">
            {loading ? (
              <Spinner size="sm" />
            ) : skills.length > 0 ? (
              skills.map((skill) => (
                <FormField
                  key={skill.id}
                  control={form.control}
                  name="skillIds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(skill.id)}
                          onCheckedChange={(checked) => {
                            checked
                              ? addSkill(field, skill)
                              : removeSkill(field, skill)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        {skill.name}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500">
                {selectedCategory
                  ? 'No skills available in this category'
                  : 'Select a category to view skills'}
              </p>
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  )
}
