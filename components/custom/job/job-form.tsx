"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect, useTransition } from "react"

import { EditIcon, XIcon } from "lucide-react"
import { JobSchema } from "@/schemas"
import { postJob } from "@/actions/pdr/job"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/custom/form-error"
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { Chip } from "@/components/ui/chip"
import usePSGCAddressFields from "@/hooks/usePSGCAddressFields"
import { AsyncStrictCombobox } from "../combobox"
import { ComboboxItem } from "@/constants/types"

type JobForm = z.infer<typeof JobSchema>
interface PartialFieldsProps {
  form: ReturnType<typeof useForm<JobForm>>
  setStep: React.Dispatch<React.SetStateAction<number>>
}

function NameAndDescriptionFields({
  form,
  setStep
}: PartialFieldsProps) {
  const isJobNameAndDescriptionFilled = (
    !!form.getValues().name
    && !form.getFieldState('name').invalid
  ) && (
      !!form.getValues().description
      && !form.getFieldState('description').invalid
    )
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Name</FormLabel>
            <FormControl>
              <Input placeholder="Job Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Job description goes here" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" disabled={!isJobNameAndDescriptionFilled} onClick={() => setStep(1)}>Next</Button>
    </>
  )
}

interface AddressFieldsProps extends PartialFieldsProps {
  step: number
}

function AddressFields({ form, step, setStep }: AddressFieldsProps) {
  const canProceed = !!form.getValues().province && !!form.getValues().city_muni && !!form.getValues().barangay

  const {
    provinces,
    cityMunicipalities,
    barangays,
    getProvinces,
    getCityMunicipalities,
    getBarangays
  } = usePSGCAddressFields()

  useEffect(() => {
    getProvinces()
    const subscription = form.watch(({ province, city_muni }) => {
      if (province) getCityMunicipalities(province)
      if (city_muni) getBarangays(city_muni)
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch])

  return (
    <>
      <h3 className="text-xl mt-2">Where will the job be done?</h3>
      <div className="flex gap-x-4 [&>*]:basis-1/3">
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block">Province</FormLabel>
              <FormControl>
                <AsyncStrictCombobox
                  items={provinces}
                  placeholder="Select province"
                  value={field.value}
                  onValueChange={value => form.setValue("province", value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city_muni"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block">City/Municipality</FormLabel>
              <FormControl>
                <AsyncStrictCombobox
                  items={cityMunicipalities}
                  placeholder="Select city/municipality"
                  value={field.value}
                  onValueChange={value => form.setValue("city_muni", value)}
                  disabled={!form.watch("province")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /><FormField
          control={form.control}
          name="barangay"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block">Barangay</FormLabel>
              <FormControl>
                <AsyncStrictCombobox
                  items={barangays}
                  placeholder="Select barangay"
                  value={field.value}
                  onValueChange={value => form.setValue("barangay", value)}
                  disabled={!form.watch("city_muni")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {step === 1 && (
        <Button type="button" onClick={() => setStep(2)} disabled={!canProceed}>Next</Button>
      )}
    </>
  )
}

function SkillsField({ form, setStep }: PartialFieldsProps) {
  // TODO: make and use `Autocomplete` component to search skills
  const supabase = createClient()
  const [skills, setSkills] = useState<ComboboxItem[]>([])
  const [selectedSkills, setSelectedSkills] = useState<Record<string, string>[]>([])
  const [search, setSearch] = useState("")

  function addSkill(value: ComboboxItem['value']) {
    const [id] = value.split("|")
    form.setValue('skill_ids', [...form.getValues().skill_ids, id])
    setStep(3)

    setSearch("")
  }
  function removeSkill(id: string) {
    const skillIds = form.getValues().skill_ids
    form.setValue('skill_ids', skillIds.filter(skillId => skillId !== id))
    if (skillIds.length === 1) setStep(2)

    setSearch("")
  }

  useEffect(() => {
    supabase
      .from('skills')
      .select('id,name')
      .order('name', { ascending: true })
      .range(0, 5)
      .then(({ data }) => {
        if (!data) return;

        setSkills(
          data.map(({ id, name }) => ({ value: `${id}|${name}`, label: name }))
        )
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const subscription = form.watch(({ skill_ids }, { name }) => {
      if (!skill_ids) return
      if (name !== "skill_ids") return

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
      <div className="flex gap-x-2">
        {!!selectedSkills.length && selectedSkills.map(({ id, name }) => (
          <Chip
            key={id}
            content={name}
            afterContent={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSkill(id)}
              >
                <XIcon />
              </Button>
            }
          />
        ))}
      </div>
    </>
  )
}

function PriceField({ form }: Pick<PartialFieldsProps, 'form'>) {
  return (
    <>
      <h3 className="text-xl mt-2">How much will it cost?</h3>
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input inputMode="numeric" placeholder="Leave empty if TBD" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export function JobForm() {
  // TODO: store state in URL
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string>()

  const form = useForm<JobForm>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      province: '',
      city_muni: '',
      barangay: '',
      skill_ids: [],
    }
  })
  const canPost = Object.values(form.getValues()).every(value => (
    value instanceof Array ? !!value.length : !!value
  ))

  function onSubmit() {
    startTransition(() => {
      postJob(form.getValues(), true).then(data => {
        if (data?.error) setError(data.error)
      })
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 space-y-6"
      >
        {step === 0 ? (
          <NameAndDescriptionFields
            form={form}
            setStep={setStep}
          />
        ) : (
          <div className="flex justify-between w-full">
            <h3 className="font-bold text-gray-500">{form.getValues().name}</h3>
            <Button size="icon" variant="ghost" onClick={() => setStep(0)}><EditIcon /></Button>
          </div>
        )}
        {step > 0 && (
          <AddressFields form={form} step={step} setStep={setStep} />
        )}
        {step > 1 && (
          <SkillsField form={form} setStep={setStep} />
        )}
        {step > 2 && (
          <PriceField form={form} />
        )}
        <FormError message={error} />
        {step >= 3 && (
          <Button disabled={isPending || !canPost}>Post Job</Button>
        )}
      </form >
    </Form >
  )
}
