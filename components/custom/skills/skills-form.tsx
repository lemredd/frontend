import * as z from 'zod'
import { useState, useEffect, useTransition } from "react"
import { ControllerRenderProps, UseFormReturn } from "react-hook-form"

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormError } from '@/components/custom/form-error'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'

import { SkillsSchema } from "@/schemas"
import { addSkills } from "@/actions/skills"
import { createClient } from "@/utils/supabase/client"


interface Props<S = Record<string, string>> {
  selectedCategory: string
  form: UseFormReturn<z.infer<typeof SkillsSchema>>
  skills: S[]
  setSkills: React.Dispatch<React.SetStateAction<S[]>>
}
export function SkillsForm({ selectedCategory, form, skills, setSkills }: Props) {
  const supabase = createClient()

  const [error, setError] = useState<string | undefined>('')

  useEffect(() => {
    if (!selectedCategory) return

    supabase
      .from("skills")
      .select("id,name")
      .eq("skill_category_id", selectedCategory)
      .then(({ data }) => {
        setSkills(data!)
      })
  }, [selectedCategory])

  function addSkill(
    field: ControllerRenderProps<z.infer<typeof SkillsSchema>>,
    skill: Record<string, string>
  ) {
    field.onChange([...field.value, skill.id])
  }

  function removeSkill(
    field: ControllerRenderProps<z.infer<typeof SkillsSchema>>,
    skill: Record<string, any>
  ) {
    field.onChange((field.value as string[]).filter((id: string) => id !== skill.id))
  }

  const [isPending, startTransition] = useTransition()

  const onSubmit = () => {
    startTransition(() => {
      addSkills({ ...form.getValues() }).then((data) => {
        if (data?.error) return setError(data?.error)
      })
    })
  }

  return (
    <>
      <Card>
        <CardHeader><h3 className="text-lg">Select skills</h3></CardHeader>
        <Form {...form}>
          <form
            id="skills-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <CardContent className="space-y-4">
              {!!(skills && skills.length) && skills.map(skill => (
                <FormField
                  key={skill.id}
                  control={form.control}
                  name="skillIds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(skill.id)}
                          onCheckedChange={checked => {
                            checked
                              ? addSkill(field, skill)
                              : removeSkill(field, skill)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">{skill.name}</FormLabel>
                    </FormItem>
                  )}
                />
              ))
              }
              {!selectedCategory && (
                <p className="text-sm text-slate-500">Select a category to see available skills</p>
              )}
              {(selectedCategory && !skills.length) && (
                <p className="text-sm text-slate-500">This category has no skills yet.</p>
              )}
            </CardContent>
            <FormError message={error} />
            {/* <FormSuccess message={success} /> */}
          </form>
          <Button
            form="skills-form"
            type="submit"
            disabled={isPending}
            className="w-max absolute -bottom-16 right-0"
          >
            Proceed
          </Button>
        </Form>
      </Card>
    </>
  )
}
