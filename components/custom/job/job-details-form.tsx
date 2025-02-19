'use client'

import { deleteJob as _deleteJob, editJob } from '@/actions/job'
import JobDetailsSkills from '@/components/custom/job/job-details-skills'
import NotFound from '@/components/custom/not-found'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { useJobSetups } from '@/hooks/useEnumTypes'
import usePSGCAddressFields from '@/hooks/usePSGCAddressFields'
import { useSkills } from '@/hooks/useSkills'
import { EditJobSchema } from '@/lib/schema'
import { formatDescription, getAddress, getRecency } from '@/lib/utils'
import { useJobStore } from '@/store/JobStore'
import { createClient } from '@/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Clock,
  MapPin,
  Pencil,
  PhilippinePesoIcon,
  Trash,
  XCircleIcon,
  XIcon,
} from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AsyncStrictCombobox } from '../combobox'
import { CompleteJobForm } from './complete-job-form'

export function JobDetailsForm() {
  const { job, isOwned, isEditing, setEditing, isJobOpen } = useJobStore()
  const [isPending, startTransition] = useTransition()
  const [mustReset, setMustReset] = useState(true)
  const supabase = createClient()

  const form = useForm<z.infer<typeof EditJobSchema>>({
    resolver: zodResolver(EditJobSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      province: '',
      city_muni: '',
      barangay: '',
      setup: '',
      skill_ids: [],
    },
  })

  const {
    provinces,
    getProvinces,
    cityMunicipalities,
    getCityMunicipalities,
    barangays,
    getBarangays,
  } = usePSGCAddressFields()
  useEffect(() => {
    getProvinces()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const subscription = form.watch(() => {
      getCityMunicipalities(form.watch('province', undefined))
      getBarangays(form.watch('city_muni', undefined))
    })

    return () => subscription?.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch])

  const {
    skills,
    // setSkills
  } = useSkills(supabase)
  const selectedSkills = skills.filter((skill) =>
    form.watch('skill_ids', [])?.includes(skill.value.split('|')[0]),
  )

  function addSkill(value: string) {
    const skillIds = form.getValues('skill_ids')
    const [id] = value.split('|')
    if (skillIds?.includes(id)) return undefined

    form.setValue('skill_ids', [...skillIds!, id])
  }

  function removeSkill(id: string) {
    const [_id] = id.split('|')
    form.setValue(
      'skill_ids',
      form.getValues('skill_ids')!.filter((skillId) => skillId !== _id),
    )
  }

  //useEffect(() => {
  //  if (!job) return
  //  setSkills(
  //    prev => prev.filter(
  //      skill => !job.job_skills.some((jobSkill: Record<string, any>) => jobSkill.skills.id === skill.value.split('|')[0])
  //    )
  //  )
  //  // eslint-disable-next-line react-hooks/exhaustive-deps
  //}, [job])

  useEffect(() => {
    if (!job) return undefined
    if (!mustReset) return undefined

    form.reset({
      id: job.id,
      name: job.name,
      description: job.description,
      province: provinces.find((province) => province.label === job.province)
        ?.value,
      city_muni: cityMunicipalities.find(
        (cityMuni) => cityMuni.label === job.city_muni,
      )?.value,
      barangay: barangays.find((barangay) => barangay.label === job.barangay)
        ?.value,
      setup: job.setup,
      skill_ids: job.job_skills.map(
        ({ skills: skill }: Record<string, any>) => skill.id,
      ),
    })

    setMustReset(!Object.values(form.getValues()).every(Boolean))
  }, [job, form, provinces, cityMunicipalities, barangays, mustReset])

  function setProvince(value: string) {
    form.setValue('province', value)
    form.setValue('city_muni', '')
    form.setValue('barangay', '')
  }

  const { setups, getSetups } = useJobSetups()
  useEffect(() => {
    getSetups()
    if (!job) return
    form.reset({
      name: job.name,
      description: job.description,
      setup: job.setup,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job])

  if (!job) {
    return <NotFound className="text-foreground h" />
  }

  function onSubmit() {
    startTransition(() => {
      editJob(form.getValues()).then((data) => {
        if (data?.error) return console.error(data)

        location.reload()
      })
    })
  }

  function deleteJob() {
    _deleteJob(job?.id).then((data) => {
      if (data?.error) return console.error(data)
      location.href = '/pdr/tasks'
    })
  }

  if (!isOwned || !isEditing)
    return (
      <Card className="modern-card">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4">
            {/* Job Date */}
            <div className="flex justify-between items-center">
              <div className="text-sm dark:text-gray-400 flex items-center gap-2">
                <Clock
                  size={18}
                  className="dark:text-gray-500"
                />
                <span>Posted {getRecency(job.created_at as string)}</span>
              </div>
              {/* Job Location */}
              <div className="flex gap-x-2">
                <Chip
                  beforeContent={<MapPin size={18} />}
                  content={getAddress(job)}
                  className="bg-primary !w-fit text-white text-sm rounded-full px-4 py-1 flex items-center gap-1 shadow-md"
                  contentClassName="max-w-[unset]"
                />
                <Chip
                  getStatusColor
                  content={job?.setup}
                  className="uppercase !w-fit text-sm rounded-full px-4 py-1 flex items-center gap-1 shadow-md"
                  contentClassName="max-w-[unset]"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col space-y-6">
          {/* Job Price */}
          <div className="flex items-center gap-4 text-2xl font-semibold">
            <PhilippinePesoIcon
              size={22}
              className="text-green-400"
            />
            <span>{Number(job.price).toFixed(2)}</span>
          </div>

          {/* Job Skills */}
          <JobDetailsSkills job={job} />

          {/* Job Description */}
          <h2 className="text-lg font-semibold">Description</h2>
          <CardDescription
            className="whitespace-pre-line dark:text-gray-300"
            dangerouslySetInnerHTML={{
              __html: formatDescription(job.description as string),
            }}
          />
        </CardContent>

        {/* Edit and Delete Buttons */}
        <CardFooter className="justify-end space-x-3">
          {!isJobOpen() && job.status !== 'completed' && <CompleteJobForm />}
          {isJobOpen() && (
            <Button
              variant="secondary"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2"
            >
              <Pencil size={18} />
              Edit
            </Button>
          )}
          {!isJobOpen() && job.status !== 'completed' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  {isJobOpen() ? (
                    <>
                      <Trash size={18} />
                      Delete
                    </>
                  ) : (
                    <>
                      <XCircleIcon size={18} />
                      Cancel
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure about this?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  This action is irreversible
                </DialogDescription>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={deleteJob}
                  >
                    Yes
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">No</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    )

  return (
    <Card className="modern-card">
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="text"
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isPending}
                      className="bg-background"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
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
                    <FormLabel className="block">City/Municipality</FormLabel>
                    <FormControl>
                      <AsyncStrictCombobox
                        items={cityMunicipalities}
                        placeholder="Select city/municipality"
                        value={field.value}
                        onValueChange={(value) =>
                          form.setValue('city_muni', value)
                        }
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
                    <FormLabel className="block">Barangay</FormLabel>
                    <FormControl>
                      <AsyncStrictCombobox
                        items={barangays}
                        placeholder="Select barangay"
                        value={field.value}
                        onValueChange={(value) =>
                          form.setValue('barangay', value)
                        }
                        disabled={!form.watch('city_muni')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="setup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work setup</FormLabel>
                    <FormControl>
                      <AsyncStrictCombobox
                        items={setups}
                        placeholder="Select work setup"
                        value={form.watch(field.name)}
                        onValueChange={(value) => form.setValue('setup', value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <>
              <h3 className="text-xl mt-2">Required Skills</h3>
              <AsyncStrictCombobox
                items={skills}
                placeholder="Search for skills, e.g., JavaScript, Project Management"
                value=""
                onValueChange={addSkill}
              />
              <div className="flex items-center gap-x-2">
                {!!selectedSkills.length &&
                  selectedSkills.map(({ value: id, label: name }) => (
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
            <div className="flex justify-end gap-x-2">
              <Button
                type="button"
                className="uppercase"
                variant="secondary"
                onClick={() => setEditing(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="uppercase"
                disabled={isPending}
                onClick={onSubmit} // using form `onSubmit` seems to not work
              >
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
