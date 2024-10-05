'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { addSkills } from '@/actions/skr/skills'
import { FormError } from '@/components/custom/form-error'
import SetupWrapper from '@/components/custom/setup-wrapper'
import { SelectedSkills } from '@/components/custom/skills/selected-skills'
import { SkillCategories } from '@/components/custom/skills/skill-categories'
import { SkillsForm } from '@/components/custom/skills/skills-form'
import { Button } from '@/components/ui/button'
import { SkillsSchema } from '@/lib/schema'
import { cn } from '@/lib/utils' // utility for conditionally applying classNames
import { zodResolver } from '@hookform/resolvers/zod'

export default function UserSetupPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [skills, setSkills] = useState<Record<string, string>[]>([])

  const form = useForm<z.infer<typeof SkillsSchema>>({
    resolver: zodResolver(SkillsSchema),
    defaultValues: {
      skillIds: [],
    },
    mode: 'onChange',
  })

  const [error, setError] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const onSubmit = () => {
    startTransition(() => {
      addSkills({ ...form.getValues() }).then((data) => {
        if (data?.error) return setError(data?.error)
      })
    })
  }

  return (
    <SetupWrapper title="Tell us about your skills">
      <div className="flex flex-col gap-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Skill Categories */}
          <SkillCategories
            setSelectedCategory={setSelectedCategory}
            className="md:col-span-1"
          />

          {/* Skills and Selected Skills */}
          <div className="md:col-span-2 space-y-6">
            <SkillsForm
              selectedCategory={selectedCategory}
              form={form}
              skills={skills}
              setSkills={setSkills}
              onSubmit={onSubmit}
            />

            <SelectedSkills form={form} />
          </div>
        </div>

        {/* Error message */}
        <FormError message={error} />

        {/* Proceed Button */}
        <div className="flex justify-end mt-6">
          <Button
            form="skills-form"
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className={cn(
              'transition-all',
              !form.formState.isValid || isPending
                ? 'bg-gray-200'
                : 'bg-blue-600 hover:bg-blue-500',
            )}
          >
            {isPending ? 'Loading...' : 'Proceed'}
          </Button>
        </div>
      </div>
    </SetupWrapper>
  )
}
