import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ComboboxItem } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { AsyncStrictCombobox } from '../combobox'
import { XIcon } from 'lucide-react'
import { SkillsSchema } from "@/lib/schema"


interface EditSkillsFormProps {
  selectedSkills?: Record<string, any>[]
}
function EditSkillsForm({ selectedSkills }: EditSkillsFormProps) {
  const supabase = createClient()
  const [skills, setSkills] = useState<ComboboxItem[]>([])
  const [clonedSelectedSkills, setClonedSelectedSkills] = useState<EditSkillsFormProps['selectedSkills']>(selectedSkills)
  const [search, setSearch] = useState('')

  const form = useForm<z.infer<typeof SkillsSchema>>({
    resolver: zodResolver(SkillsSchema),
    defaultValues: { skillIds: selectedSkills?.map(({ id }) => id) },
  })

  function addSkill(id: string) {
    const skill = skills.find(skill => skill.value.startsWith(id))
    if (!skill) return

    form.setValue(
      "skillIds",
      [...form.getValues("skillIds"), id]
    )
    setClonedSelectedSkills(prev => [
      ...prev!,
      { id: skill.value.split('|')[0], name: skill.label }
    ])
    setSearch('')
  }

  function removeSkill(id: string) {
    form.setValue(
      "skillIds",
      form.getValues("skillIds").filter(skillId => skillId !== id)
    )
    setClonedSelectedSkills(clonedSelectedSkills!.filter(skill => skill.id !== id))
  }

  useEffect(() => {
    const addedSkillIds = form.watch("skillIds")
    supabase
      .from('skills')
      .select('id,name')
      .order('name', { ascending: true })
      .range(0, 5)
      .then(({ data }) => {
        if (!data) return
        setSkills(
          data
            .filter(({ id }) => !addedSkillIds.includes(id.toString()))
            .map(({ id, name }) => ({ value: `${id}|${name}`, label: name })),
        )
      })
  }, [form, supabase])

  useEffect(() => {
    const subscription = form.watch(({ skillIds }) => {
      if (!skillIds) return;

      supabase
        .from('skills')
        .select('id,name')
        .order('name', { ascending: true })
        .range(0, 5)
        .then(({ data }) => {
          if (!data) return
          setSkills(
            data
              .filter(({ id }) => !skillIds.includes(id.toString()))
              .map(({ id, name }) => ({ value: `${id}|${name}`, label: name })),
          )
        })
    })
    return () => subscription.unsubscribe()
  }, [form, supabase])

  return (
    <form className="space-y-4">
      <AsyncStrictCombobox
        items={skills}
        placeholder="Search for skills, e.g., JavaScript, Project Management"
        value={search}
        onValueChange={addSkill}
      />
      <div className="flex items-center flex-wrap gap-2">
        {!!clonedSelectedSkills &&
          clonedSelectedSkills.map(({ id, name }) => (
            <Chip
              key={id}
              content={name}
              className="w-max"
              afterContent={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="!p-0 size-5"
                  onClick={() => removeSkill(id)}
                >
                  <XIcon className="size-3" />
                </Button>
              }
            />
          ))}
      </div>
      <DialogFooter>
        <Button type="submit" variant="default">
          Save
        </Button>
      </DialogFooter>
    </form>
  )
}

interface SeekerSkillsListProps {
  skills?: Record<string, any>[]
}
export function SeekerSkillsList({ skills }: SeekerSkillsListProps) {
  return (
    <ul className="flex items-center gap-x-2 flex-wrap">
      {!!skills && skills.map(({ skills: skill }) => (
        <li key={skill.id}>
          <Chip content={skill.name} className="w-max" />
        </li>
      ))}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-x-2"><Plus size={16} /> Add Skill</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Remove Skill</DialogTitle>
          </DialogHeader>
          <EditSkillsForm selectedSkills={skills.map(({ skills: skill }) => ({ id: skill.id, name: skill.name }))} />

        </DialogContent>
      </Dialog>
    </ul>
  )
}
