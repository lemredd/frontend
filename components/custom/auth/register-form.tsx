'use client'
import { register, registerWithRole } from '@/actions/register'
import { CardWrapper } from '@/components/custom/auth/card-wrapper'
import { FormError } from '@/components/custom/form-error'
import { FormSuccess } from '@/components/custom/form-success'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { RegisterSchema, RoleSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  //const [success, setSuccess] = useState<string | undefined>('')
  const [step, setStep] = useState(0)

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })


  const roleForm = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues: { roleCode: '', }
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) return setError(data?.error)

        setStep(1)
      })
    })
  }

  const onRoleSubmit = (values: z.infer<typeof RoleSchema>) => {
    startTransition(() => {
      registerWithRole({ ...values, ...form.getValues() }).then((data) => {
        if (data?.error) return setError(data?.error)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel={!step ? "Create an account" : "Select your role"}
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      {!step && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="text"
                        placeholder="Juan"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="text"
                        placeholder="Juan Dela Cruz"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="juan.delacruz@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">
                      I agree to the Task Grabber{' '}
                      <a
                        href="#"
                        target="_blank"
                        className="text-primary underline"
                      >
                        Agreement
                      </a>{' '}
                      and{' '}
                      <a
                        href="#"
                        target="_blank"
                        className="text-primary underline"
                      >
                        Privacy Policy
                      </a>
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            {/* <FormSuccess message={success} /> */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              Proceed
            </Button>
          </form>
        </Form>
      )}

      {step === 1 && (
        <>
          <Button className="mb-4" variant="link" onClick={() => setStep(0)}>Back</Button>
          <Form {...roleForm}>
            <form
              onSubmit={roleForm.handleSubmit(onRoleSubmit)}
              className="space-y-6"
            >
              <FormField control={roleForm.control} name="roleCode" render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select a role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {/* TODO: wrap in Card */}
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="SKR" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I will grab tasks
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="PDR" />
                        </FormControl>
                        <FormLabel className="font-normal">I will post tasks</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormError message={error} />
              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                Join Task Grabber
              </Button>
            </form>
          </Form>
        </>
      )
      }
    </CardWrapper >
  )
}
