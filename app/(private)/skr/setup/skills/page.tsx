"use client"

import * as z from 'zod'
import { useState } from "react"
import { useForm } from "react-hook-form"

import { SkillsSchema } from "@/schemas"
import { zodResolver } from '@hookform/resolvers/zod'
import { SkillsForm } from '@/components/custom/skills/skills-form'
import { SelectedSkills } from '@/components/custom/skills/selected-skills'
import { SkillCategories } from '@/components/custom/skills/skill-categories'


export default function UserSetupPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [skills, setSkills] = useState<Record<string, string>[]>([])
  const form = useForm<z.infer<typeof SkillsSchema>>({
    resolver: zodResolver(SkillsSchema),
    defaultValues: {
      skillIds: [],
    }
  })

  return (
    <main className="flex h-full flex-col justify-center p-10" >
      <h1 className="text-3xl font-bold">Tell us about your skills</h1>

      <div className="my-8 flex gap-x-4 [&>*]:w-full relative">
        {/* Skill categories */}
        <SkillCategories setSelectedCategory={setSelectedCategory} />

        {/* Skills */}
        <SkillsForm selectedCategory={selectedCategory} form={form} skills={skills} setSkills={setSkills} />

        {/* Selected Skills */}
        <SelectedSkills form={form} />
      </div>
    </main >
  )
}
