'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { uploadDocuments } from '@/actions/documents'
import { FormError } from '@/components/custom/form-error'
import SetupWrapper from '@/components/custom/setup-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/AuthStore'
import Image from 'next/image'
import { CircleX } from 'lucide-react'

export default function ValidDocumentsPage() {
  const { refreshUser, profile } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const form = useRef<HTMLFormElement>(null)
  const [validIdPreview, setValidIdPreview] = useState('')
  const [documentsInputValue, setDocumentsInputValue] = useState('')
  const [validDocuments, setValidDocuments] = useState<File[]>([])
  const isSubmittable = !form.current ? false : (
    [...new FormData(form.current).values()].length > 0
    && validDocuments.length > 0
  )

  useEffect(() => refreshUser(), [])

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'id' | 'document',
  ) {
    const { files } = e.target

    if (type === 'id') {
      const image = files![0]
      return setValidIdPreview(URL.createObjectURL(image))
    }

    for (const file of files!) {
      setValidDocuments(prev => [...prev, file])
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!profile) return
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    for (const document of validDocuments) {
      form.append('documents', document)
    }

    startTransition(() => {
      uploadDocuments(form, profile.id).then(data => {
        if (data?.error) return setError(data.error)
      })
    })
  }

  return (
    <SetupWrapper
      title="Upload Your Valid ID and Document"
      description="Provide a valid government-issued ID and additional document to verify your account."
    >
      <form
        onSubmit={onSubmit}
        ref={form}
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
              name="id"
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
            Upload Valid Documents
          </h2>
          <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center space-y-4">
            {validDocuments.length ? (
              <>
                <div className='flex gap-2 items-center'>
                  {validDocuments.map((file, idx) => (
                    <div key={idx} className="relative group" >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Valid ID Preview"
                        width={100}
                        height={100}
                        className="object-cover rounded-md border bg-gray-50"
                      />
                      <CircleX
                        onClick={() => setValidDocuments(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0 right-0 flex items-center justify-center text-sm text-white bg-black bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition"
                      />
                    </div>
                  ))}
                </div>
                <label
                  htmlFor="valid_document"
                  className="relative w-full cursor-pointer"
                >
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-white bg-black bg-opacity-50 rounded-md">
                    + Click to add
                  </span>
                </label>
              </>
            ) : (
              <label
                htmlFor="valid_document"
                className="relative group cursor-pointer"
              >
                <span className="absolute inset-0 flex items-center justify-center text-sm text-white bg-black bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition">
                  + Click to add
                </span>
                <Image
                  src="/images/landscape_id_placeholder.webp"
                  alt="Valid ID Preview"
                  width={100}
                  height={100}
                  className="object-cover rounded-md border bg-gray-50"
                />
              </label>
            )}
            <Input
              type="file"
              multiple
              id="valid_document"
              className="hidden"
              accept="image/*"
              value={documentsInputValue}
              onClick={() => setDocumentsInputValue('')}
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
            disabled={isPending || !isSubmittable}
            className="relative"
          >
            {isPending && <span className="absolute left-4 spinner"></span>}
            Submit
          </Button>
        </div>
      </form>
    </SetupWrapper>
  )
}
