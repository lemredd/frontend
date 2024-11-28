'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { editProfile } from '@/actions/profile'
import { uploadProfilePicture } from '@/actions/profile-picture'
import { FormError } from '@/components/custom/form-error'
import SetupWrapper from '@/components/custom/setup-wrapper'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProfileDescriptionSchema } from '@/lib/schema'
import { useAuthStore } from '@/store/AuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'

export default function UserDescriptionPage() {
  const { refreshUser, user } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const { profile } = useAuthStore()
  const form = useForm<z.infer<typeof ProfileDescriptionSchema>>({
    resolver: zodResolver(ProfileDescriptionSchema),
    defaultValues: {
      shortDescription: '',
      longDescription: '',
      username: '',
    },
  })
  const [profilePicturePreview, setProfilePicturePreview] = useState('')

  useEffect(() => refreshUser(), [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target
    const image = files?.item(0)

    if (!image) return
    const form = new FormData()
    form.set('profile_picture', image)
    form.set('name', profile!.id)
    uploadProfilePicture(form).then((data) => {
      if (data?.error) return console.error(data?.error)
      setProfilePicturePreview(URL.createObjectURL(image))
    })
  }

  useEffect(() => {
    if (!user) return

    form.reset({
      username: user.email?.split('@')[0],
    })
  }, [user, form])

  function onSubmit() {
    startTransition(() => {
      editProfile(form.getValues()).then((data) => {
        if (data?.error) return setError(data?.error)
      })
    })
  }

  return (
    <SetupWrapper
      title="Tell us about yourself"
      description="Complete your profile information to get started."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-6 shadow rounded-lg"
        >
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <label
              htmlFor="profile_picture"
              className="relative group"
            >
              <Image
                src={
                  profilePicturePreview ||
                  '/images/profile_picture_placeholder.webp'
                }
                alt="Profile picture"
                width={100}
                height={100}
                className="cursor-pointer rounded-full border hover:opacity-80 transition"
              />
              <span className="absolute inset-0 flex items-center justify-center text-sm hover:cursor-pointer text-white bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition">
                Change
              </span>
            </label>
            <Input
              type="file"
              id="profile_picture"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Username
                  <p className="text-sm text-muted-foreground">
                    Your unique identifier on the platform.
                  </p>
                </FormLabel>
                <Input {...field} />
              </FormItem>
            )}
          />

          {/* Short Description */}
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Short Description
                  <p className="text-sm text-muted-foreground">
                    Write a brief one-line summary about yourself.
                  </p>
                </FormLabel>
                <Input
                  placeholder="e.g., Full Stack Developer"
                  {...field}
                />
              </FormItem>
            )}
          />

          {/* Long Description */}
          <FormField
            control={form.control}
            name="longDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  About You
                  <p className="text-sm text-muted-foreground">
                    Share more details about your background and skills.
                  </p>
                </FormLabel>
                <Textarea
                  rows={6}
                  placeholder="Write a detailed description about yourself."
                  {...field}
                ></Textarea>
              </FormItem>
            )}
          />

          {/* Error Message */}
          {error && <FormError message={error} />}

          {/* Submit Button */}
          <div className="text-right">
            <Button
              type="submit"
              disabled={isPending}
              className="relative"
            >
              {isPending && <span className="absolute left-4 spinner"></span>}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </SetupWrapper>
  )
}
