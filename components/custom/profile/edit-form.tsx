"use client"

import { useEffect, useTransition } from "react"

import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { EditProfileSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/store/AuthStore"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EditSkillsField } from "../fields/skills-field"

export function EditForm() {
  const { profile } = useAuthStore()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      shortDescription: "",
      longDescription: "",
      skillIds: [],
      province: "",
      city_muni: "",
      barangay: "",
      postal_code: "",
      address_1: "",
      address_2: "",
    }
  })

  useEffect(() => {
    form.reset({
      shortDescription: profile?.short_desc,
      longDescription: profile?.long_desc,
      skillIds: (profile?.profile_skills as Record<string, Record<string, string>>[])
        .map(({ skills: skill }) => skill.id),
      province: profile?.addresses[0]?.province,
      city_muni: profile?.addresses[0]?.city_muni,
      barangay: profile?.addresses[0]?.barangay,
      postal_code: profile?.addresses[0]?.postal_code,
      address_1: profile?.addresses[0]?.address_1,
      address_2: profile?.addresses[0]?.address_2,
    })
  }, [profile, form])

  function onSubmit() {
    startTransition(() => {
      // TODO: make action to edit profile
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            The following information will help providers choose you for their tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-y-2">
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Professional Headline</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Your professional headline"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longDescription"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Professional Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    placeholder="Your professional description"
                    rows={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="skillIds" render={() => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <EditSkillsField form={form} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isPending}>Submit</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
