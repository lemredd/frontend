'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { uploadDocument } from '@/actions/documents'
import { FormError } from '@/components/custom/form-error'
import SetupWrapper from '@/components/custom/setup-wrapper'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ValidDocumentSchema } from '@/lib/schema'
import { useAuthStore } from '@/store/AuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'

export default function ValidDocumentsPage() {
  const { refreshUser } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const { profile } = useAuthStore()
  const form = useForm<z.infer<typeof ValidDocumentSchema>>({
    resolver: zodResolver(ValidDocumentSchema),
  })
  const [validIdPreview, setValidIdPreview] = useState('')
  const [validDocumentPreview, setValidDocumentPreview] = useState('')

  useEffect(() => refreshUser(), [])

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'id' | 'document',
  ) {
    const { files } = e.target
    const image = files?.item(0)

    if (!image) return
    const form = new FormData()
    form.set(type === 'id' ? 'valid_id' : 'valid_document', image)
    form.set('name', profile!.id)

    uploadDocument(form, type).then((data) => {
      if (data?.error) return console.error(data?.error)
      if (type === 'id') {
        setValidIdPreview(URL.createObjectURL(image))
      } else {
        setValidDocumentPreview(URL.createObjectURL(image))
      }
    })
  }

  function onSubmit() {
    startTransition(() => {
      console.log(form.getValues())
    })
  }

  return (
    <SetupWrapper
      title="Upload Your Valid ID and Document"
      description="Provide a valid government-issued ID and additional document to verify your account."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-6 shadow rounded-lg"
        >
          {/* VALID ID UPLOAD */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Upload Valid ID</h2>
            <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center space-y-4">
              <label
                htmlFor="valid_id"
                className="relative w-full max-w-lg group cursor-pointer"
              >
                <Image
                  src={
                    validIdPreview || '/images/landscape_id_placeholder.webp'
                  }
                  alt="Valid ID Preview"
                  width={600}
                  height={338}
                  className="object-cover rounded-md border bg-gray-50"
                />
                <span className="absolute inset-0 flex items-center justify-center text-sm text-white bg-black bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition">
                  Click to change
                </span>
              </label>
              <Input
                type="file"
                id="valid_id"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'id')}
              />
              <p className="text-sm text-muted-foreground">
                Supported formats: JPG, JPEG, PNG. Recommended size: Landscape
                orientation (16:9).
              </p>
            </div>
          </div>

          {/* VALID DOCUMENT UPLOAD */}
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Upload Valid Document
            </h2>
            <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center space-y-4">
              <label
                htmlFor="valid_document"
                className="relative w-full max-w-lg group cursor-pointer"
              >
                <Image
                  src={
                    validDocumentPreview ||
                    '/images/landscape_id_placeholder.webp'
                  }
                  alt="Valid Document Preview"
                  width={600}
                  height={338}
                  className="object-cover rounded-md border bg-gray-50"
                />
                <span className="absolute inset-0 flex items-center justify-center text-sm text-white bg-black bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition">
                  Click to change
                </span>
              </label>
              <Input
                type="file"
                id="valid_document"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'document')}
              />
              <p className="text-sm text-muted-foreground">
                Upload documents like Proof of Competency, TESDA Certification,
                etc.
              </p>
            </div>
          </div>

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
