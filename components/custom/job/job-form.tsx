'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { postJob } from '@/actions/pdr/job'
import { CollapsibleDesc } from '@/components/custom/collapsible-desc'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import usePSGCAddressFields from '@/hooks/usePSGCAddressFields'
import { JobSchema } from '@/lib/schema'
import { ComboboxItem } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { EditIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AsyncStrictCombobox } from '../combobox'
import { useAuthStore } from '@/store/AuthStore'

type JobForm = z.infer<typeof JobSchema>
interface PartialFieldsProps {
  form: ReturnType<typeof useForm<JobForm>>
  setStep: React.Dispatch<React.SetStateAction<number>>
}

function NameAndDescriptionFields({ form, setStep }: PartialFieldsProps) {
  const isJobNameAndDescriptionFilled =
    !!form.getValues().name &&
    !form.getFieldState('name').invalid &&
    !!form.getValues().description &&
    !form.getFieldState('description').invalid
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter a descriptive job name, e.g., Frontend Design"
                {...field}
              />
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
              <Textarea
                placeholder="Provide a detailed description of the job, including responsibilities and requirements"
                {...field}
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        disabled={!isJobNameAndDescriptionFilled}
        onClick={() => setStep(1)}
      >
        Next
      </Button>
    </>
  )
}

interface AddressFieldsProps extends PartialFieldsProps {
  step: number
}

function AddressFields({ form, step, setStep }: AddressFieldsProps) {
  const canProceed =
    !!form.getValues().province &&
    !!form.getValues().city_muni &&
    !!form.getValues().barangay

  const {
    provinces,
    cityMunicipalities,
    barangays,
    getProvinces,
    getCityMunicipalities,
    getBarangays,
  } = usePSGCAddressFields()

  useEffect(() => {
    getProvinces()
    const subscription = form.watch(({ province, city_muni }, { name }) => {
      if (!['province', 'city_muni', 'barangay'].includes(name!)) return

      if (province) getCityMunicipalities(province)
      if (city_muni) getBarangays(city_muni)
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch])

  function setProvince(value: string) {
    form.setValue('province', value)
    form.setValue('city_muni', '')
    form.setValue('barangay', '')
  }

  return (
    <>
      <h3 className="text-xl mt-2">Job Location</h3>
      <div className="flex gap-x-4 [&>*]:basis-1/3">
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <AsyncStrictCombobox
                  items={provinces}
                  placeholder="Select the province"
                  value={field.value}
                  onValueChange={setProvince}
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
              <FormLabel>City/Municipality</FormLabel>
              <FormControl>
                <AsyncStrictCombobox
                  items={cityMunicipalities}
                  placeholder="Select the city or municipality"
                  value={field.value}
                  onValueChange={(value) => form.setValue('city_muni', value)}
                  disabled={!form.watch('province')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barangay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barangay</FormLabel>
              <FormControl>
                <AsyncStrictCombobox
                  items={barangays}
                  placeholder="Select the barangay"
                  value={field.value}
                  onValueChange={(value) => form.setValue('barangay', value)}
                  disabled={!form.watch('city_muni')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {step === 1 && (
        <Button
          type="button"
          onClick={() => setStep(2)}
          disabled={!canProceed}
        >
          Next
        </Button>
      )}
    </>
  )
}

function SkillsField({ form, setStep }: PartialFieldsProps) {
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
      <h3 className="text-xl mt-2">Required Skills</h3>
      <AsyncStrictCombobox
        items={skills}
        placeholder="Search for skills, e.g., JavaScript, Project Management"
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

function PriceField({ form }: Pick<PartialFieldsProps, 'form'>) {
  return (
    <>
      <h3 className="text-xl mt-2">Budget</h3>
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Price</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter a price (e.g., 1500)"
                {...field}
                value={field.value !== undefined ? field.value : ''}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(value === '' ? undefined : value)
                }}
              />
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
  const { profile } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

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
    },
  })
  const canPost = Object.values(form.getValues()).every((value) =>
    value instanceof Array ? !!value.length : !!value,
  )

  function onSubmit() {
    startTransition(() => {
      postJob(form.getValues(), !profile?.is_completed).then((data) => {
        if (data?.error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: data?.error,
          })
        } else {
          toast({
            variant: 'success',
            title: 'Task Posted Successfully!',
          })
          router.push('/pdr/tasks/')
        }
      })
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {step === 0 ? (
          <NameAndDescriptionFields
            form={form}
            setStep={setStep}
          />
        ) : (
          <div className="flex items-center justify-between w-full p-6 bg-white rounded-lg shadow-lg border border-gray-300 text-gray-800 transition duration-150 hover:shadow-xl">
            <div className="flex flex-col">
              <h3 className="font-bold text-xl text-gray-900">
                {form.getValues().name || 'Untitled Job'}
              </h3>
              <CollapsibleDesc
                content={
                  form.getValues().description || 'No description provided'
                }
                className="mt-1"
              />
              <p className="mt-2 text-sm text-gray-500">
                Click edit to update the job details
              </p>
            </div>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setStep(0)}
              aria-label="Edit Job Name"
            >
              <EditIcon className="size-6" />
            </Button>
          </div>
        )}
        {step > 0 && (
          <AddressFields
            form={form}
            step={step}
            setStep={setStep}
          />
        )}
        {step > 1 && (
          <SkillsField
            form={form}
            setStep={setStep}
          />
        )}
        {step > 2 && <PriceField form={form} />}
        {step >= 3 && (
          <Button disabled={isPending || !canPost}>Post Job</Button>
        )}
      </form>
    </Form>
  )
}
