import { uploadProfilePicture } from '@/actions/profile-picture'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Profile, useAuthStore } from '@/store/AuthStore'
import { Edit } from 'lucide-react'
import Image from 'next/image'
import { useState, useTransition } from 'react'

function ProfilePictureForm() {
  // Not using react-hook-form kasi idk pano magpasa ng `File` sa server action nang naka schema
  // Check `actions/profile-picture.ts`. Doon ko na vinavalidate ang form data
  const { profile } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState("")
  //const form = useForm<z.infer<typeof ProfilePictureSchema>>({
  //  resolver: zodResolver(ProfilePictureSchema),
  //})

  function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!profile) return
    startTransition(() => {
      const form = new FormData(event.currentTarget)
      form.append('name', profile.id)

      uploadProfilePicture(form).then(({ success, error }) => {
        if (error) return console.error(error)
        console.log(success)
      })
    })
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { files } = e.target
    const image = files?.item(0)

    if (!image) return
    setPreview(URL.createObjectURL(image))
  }

  return (
    <>
      <form onSubmit={upload} id="profile-picture-form" className="space-y-4">
        <Input
          type="file"
          name="profile_picture"
          onChange={handleFileChange}
        />
        {!!preview && (
          <Image
            alt="profile picture preview"
            className="rounded-md w-auto h-auto"
            height={0}
            width={0}
            src={preview}
          />
        )}
      </form>
      <DialogFooter>
        <Button type="submit" form="profile-picture-form" disabled={isPending}>Upload</Button>
      </DialogFooter>
    </>
  )
}

interface ProfilePictureProps {
  profile: Profile | null
}
export function ProfilePicture({ profile: _ }: ProfilePictureProps) {
  const avatarSrc = 'https://placehold.co/150'

  return (
    <div className="relative mx-auto sm:mx-0">
      <Avatar className="size-32 rounded-full shadow-md border-4 border-primary">
        <AvatarImage
          src={avatarSrc}
          alt="Profile Avatar"
        />
      </Avatar>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-2 right-2 rounded-full p-2 shadow-m"
          >
            <Edit size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
            <DialogDescription>Upload a new profile picture</DialogDescription>
          </DialogHeader>
          <ProfilePictureForm />

        </DialogContent>
      </Dialog>
    </div>
  )
}
