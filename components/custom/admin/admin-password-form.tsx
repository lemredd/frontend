'use client'

import { changeAdminPassword } from '@/actions/user'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import PasswordStrength from '@/components/ui/password-strength'
import { toast } from '@/hooks/use-toast'
import { ChangeAdminPasswordSchema } from '@/lib/schema'
import { useAuthStore } from '@/store/AuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function AdminPasswordForm() {
  const { user } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof ChangeAdminPasswordSchema>>({
    resolver: zodResolver(ChangeAdminPasswordSchema),
    defaultValues: {
      user_id: user?.id || '',
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    },
  })

  function submit() {
    startTransition(() => {
      changeAdminPassword(form.getValues()).then(({ success, error }) => {
        if (error)
          return toast({ title: error.message, variant: 'destructive' })
        toast({ title: success, variant: 'success' })
      })
    })
  }

  useEffect(() => {
    if (!user) return
    form.reset({ ...form.getValues(), user_id: user?.id })
  }, [user, form])

  return (
    <Form {...form}>
      <div className="space-y-2 pb-4">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <p className="text-sm text-muted-foreground">
          Ensure your new password is strong and secure.
        </p>
      </div>
      <form
        className="space-y-6 max-w-md"
        onSubmit={form.handleSubmit(submit)}
      >
        <FormField
          name="old_password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  disabled={isPending}
                  placeholder="Enter old password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="new_password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordStrength
                  {...field}
                  disabled={isPending}
                  placeholder="Enter new password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="confirm_new_password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordStrength
                  {...field}
                  disabled={isPending}
                  placeholder="Confirm new password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
