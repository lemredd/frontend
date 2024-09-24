'use client'
import { register, registerWithRole } from '@/actions/register'
import { CardWrapper } from '@/components/custom/auth/card-wrapper'
import { FormError } from '@/components/custom/form-error'
import { Button } from '@/components/ui/button'
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
import { RadioGroup, RadioGroupCard } from '@/components/ui/radio-group'
import { RegisterSchema, RoleSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import ProviderSVG from '@/public/svgs/provider.svg'
import SeekerSVG from '@/public/svgs/seeker.svg'
import { ChevronLeft } from 'lucide-react'

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  const [step, setStep] = useState(0)

  const role_selections = [
    {
      label: 'Seeker',
      value: 'SKR',
      icon: SeekerSVG,
      desc: 'I will grab tasks',
    },
    {
      label: 'Provider',
      value: 'PDR',
      icon: ProviderSVG,
      desc: 'I will post tasks',
    },
  ]

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
    defaultValues: { roleCode: '' },
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
      headerLabel={!step ? 'Create an account' : 'Select your role'}
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
            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="text"
                        placeholder="Dela Cruz"
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
                    {/* TODO: ADD AGREEMENT AND PRIVACY POLICY */}
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
          <div className="flex flex-col space-y-3 mb-3">
            <Button
              variant="link"
              onClick={() => {
                setStep(0)
                setError('')
              }}
              className="w-fit inline-flex space-x-2 items-center justify-center p-0"
            >
              <ChevronLeft />
              Back
            </Button>

            <div className="flex space-x-3">
              <h1 className="text-lg font-semibold">Select account role</h1>
              <p></p>
            </div>
          </div>
          <Form {...roleForm}>
            <form
              onSubmit={roleForm.handleSubmit(onRoleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={roleForm.control}
                name="roleCode"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center justify-center flex-col md:flex-row md:space-x-4"
                      >
                        {role_selections.map((role) => (
                          <FormItem
                            className="w-full"
                            key={role.value}
                          >
                            <FormControl>
                              <RadioGroupCard value={role.value}>
                                <div className="flex flex-col space-x-3 items-center justify-center p-3">
                                  <role.icon className="text-primary" />
                                  <h6 className="font-semibold">
                                    {role.label}
                                  </h6>
                                  <p className="text-sm">{role.desc}</p>
                                </div>
                              </RadioGroupCard>
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
      )}
    </CardWrapper>
  )
}
