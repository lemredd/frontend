'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import SetupWrapper from '@/components/custom/setup-wrapper'
import { SelectedSkills } from '@/components/custom/skills/selected-skills'
import { SkillCategories } from '@/components/custom/skills/skill-categories'
import { SkillsForm } from '@/components/custom/skills/skills-form'
import { SkillsSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'

export default function UserSetupPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [skills, setSkills] = useState<Record<string, string>[]>([])
  const form = useForm<z.infer<typeof SkillsSchema>>({
    resolver: zodResolver(SkillsSchema),
    defaultValues: {
      skillIds: [],
    },
  })

  return (
    <SetupWrapper title="Tell us about your skills">
      <div className="my-8 flex gap-x-4 [&>*]:w-full relative">
        {/* Skill categories */}
        <SkillCategories setSelectedCategory={setSelectedCategory} />

        {/* Skills */}
        <SkillsForm
          selectedCategory={selectedCategory}
          form={form}
          skills={skills}
          setSkills={setSkills}
        />

        {/* Selected Skills */}
        <SelectedSkills form={form} />
      </div>
    </SetupWrapper>
  )
}
