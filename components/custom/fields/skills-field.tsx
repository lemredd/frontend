import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { EditProfileSchema, JobSchema } from '@/lib/schema'
import { ComboboxItem } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'
import { XIcon } from 'lucide-react'
import { AsyncStrictCombobox } from '../combobox'

type JobForm = z.infer<typeof JobSchema>

interface PartialFieldsProps {
  form: ReturnType<typeof useForm<JobForm>>
}


interface SteppedProps extends PartialFieldsProps {
  setStep: React.Dispatch<React.SetStateAction<number>>
}


export function SteppedSkillsField({ form, setStep }: SteppedProps) {
  const supabase = createClient()
  const [skills, setSkills] = useState<ComboboxItem[]>([])
  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, string>[]
  >([])
  const [search, setSearch] = useState('')

  function addSkill(value: ComboboxItem['value']) {
    const [id] = value.split('|')
    form.setValue('skill_ids', [...form.getValues().skill_ids, id])
    setStep(3)

    setSearch('')
  }
  function removeSkill(id: string) {
    const skillIds = form.getValues().skill_ids
    form.setValue(
      'skill_ids',
      skillIds.filter((skillId) => skillId !== id),
    )
    if (skillIds.length === 1) setStep(2)

    setSearch('')
  }

  useEffect(() => {
    const addedSkillIds = form.getValues().skill_ids
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
  }, [form.getValues().skill_ids])

  useEffect(() => {
    const subscription = form.watch(({ skill_ids }, { name }) => {
      if (!skill_ids) return
      if (name !== 'skill_ids') return

      supabase
        .from('skills')
        .select('id,name')
        .in('id', skill_ids)
        .then(({ data }) => setSelectedSkills(data!))
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch])

  return (
    <>
      <h3 className="text-xl mt-2">What skills will be required?</h3>
      <AsyncStrictCombobox
        items={skills}
        placeholder="Search skills"
        value={search}
        onValueChange={addSkill}
      />
      <div className="flex items-center gap-x-2">
        {!!selectedSkills.length &&
          selectedSkills.map(({ id, name }) => (
            <Chip
              key={id}
              content={name}
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
    </>
  )
}

interface EditSkillsFieldProps {
  form: ReturnType<typeof useForm<z.infer<typeof EditProfileSchema>>>
}
export function EditSkillsField({ form }: EditSkillsFieldProps) {
  const supabase = createClient()
  const [skills, setSkills] = useState<ComboboxItem[]>([])
  const [selectedSkills, setSelectedSkills] = useState<
    Record<string, string>[]
  >([])
  const [search, setSearch] = useState('')

  function addSkill(value: ComboboxItem['value']) {
    const [id] = value.split('|')
    form.setValue('skillIds', [...form.getValues().skillIds, id])

    setSearch('')
  }
  function removeSkill(id: string) {
    const skillIds = form.getValues().skillIds
    form.setValue(
      'skillIds',
      skillIds.filter((skillId: string) => skillId !== id),
    )

    setSearch('')
  }

  useEffect(() => {
    const addedSkillIds = form.getValues().skillIds
    supabase
      .from('skills')
      .select('id,name')
      .order('name', { ascending: true })
      .range(0, 5)
      .then(({ data }) => {
        if (!data) return

        setSelectedSkills(
          data.filter(skill => form.watch("skillIds").includes(skill.id))
        )

        setSkills(
          data
            .filter(({ id }) => !addedSkillIds.includes(id.toString()))
            .map(({ id, name }) => ({ value: `${id}|${name}`, label: name })),
        )
      })
  }, [form.getValues().skillIds])



  useEffect(() => {
    const subscription = form.watch(({ skillIds }, { name }) => {
      if (!skillIds) return
      if (name !== 'skillIds') return

      supabase
        .from('skills')
        .select('id,name')
        .in('id', skillIds)
        .then(({ data }) => setSelectedSkills(data!))
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch])

  return (
    <>
      <AsyncStrictCombobox
        items={skills}
        placeholder="Search skills"
        value={search}
        onValueChange={addSkill}
      />
      <div className="flex items-center gap-x-2">
        {!!selectedSkills.length &&
          selectedSkills.map(({ id, name }) => (
            <Chip
              key={id}
              content={name}
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
    </>
  )
}
