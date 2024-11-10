"use client"

import { changeAdminPassword } from "@/actions/user"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { ChangeAdminPasswordSchema } from "@/lib/schema"
import { useAuthStore } from "@/store/AuthStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export function AdminPasswordForm() {
  const { user } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof ChangeAdminPasswordSchema>>({
    resolver: zodResolver(ChangeAdminPasswordSchema),
    defaultValues: {
      user_id: user?.id || "",
      old_password: "",
      new_password: "",
    }
  })

  function submit() {
    startTransition(() => {
      changeAdminPassword(form.getValues()).then(({ success, error }) => {
        if (error) return toast({ title: error.message, variant: "destructive" })
        toast({ title: success, variant: "success" })
      })
    })
  }

  useEffect(() => {
    if (!user) return
    form.reset({ ...form.getValues(), user_id: user?.id })
  }, [user, form])

  return (
    <Form {...form}>
      <h3 className="text-lg font-medium">Change password</h3>
      <p className="text-muted-foreground">Make sure to change your password often.</p>
      <form className="my-4 space-y-4 max-w-sm" onSubmit={form.handleSubmit(submit)}>
        <FormField name="old_password" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Old password</FormLabel>
            <FormControl>
              <Input {...field} type="password" />
            </FormControl>
          </FormItem>
        )} />
        <FormField name="new_password" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>New password</FormLabel>
            <FormControl>
              <Input {...field} type="password" />
            </FormControl>
          </FormItem>
        )} />
        <FormField name="confirm_new_password" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm New password</FormLabel>
            <FormControl>
              <Input {...field} type="password" />
            </FormControl>
          </FormItem>
        )} />
        <Button disabled={isPending || !Object.values(form.getValues()).every(Boolean)}>Save</Button>
      </form>
    </Form>
  )
}
