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

export function EditForm() {
  const { profile } = useAuthStore()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      shortDescription: "",
      longDescription: "",
    }
  })

  useEffect(() => {
    if (!profile) return

    form.reset({
      shortDescription: profile?.short_desc,
      longDescription: profile?.long_desc,
      id: profile.id
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
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isPending}>Submit</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
