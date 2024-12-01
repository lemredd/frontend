"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Profile } from "@/store/AuthStore"
import { createClient } from "@/utils/supabase/client"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const supabase = createClient()

function getUrl(name: string) {
  return supabase.storage.from("documents").getPublicUrl(name.trim()).data.publicUrl
}

interface DocumentLinkProps {
  document: string
}
export function DocumentLink({ document }: DocumentLinkProps) {
  return (
    <Button asChild variant="outline" className="justify-start">
      <Link
        target="_blank"
        href={getUrl(document)}
        className="space-x-2"
      >
        <ExternalLink size={16} />
        <span className="max-w-[100px] truncate">{document}</span>
      </Link>
    </Button>
  )
}

interface SeekerDocumentsProps {
  profile: Profile | null
}
export function SeekerDocuments({ profile }: SeekerDocumentsProps) {
  const [documents, setDocuments] = useState<string[]>([])

  useEffect(() => {
    if (!profile) return
    supabase
      .rpc("get_other_documents", { _owner_id: profile.user_id })
      .then(({ data, error }) => {
        if (error) return toast({ title: error.message, variant: "destructive" })
        setDocuments(data.map((document: Record<string, any>) => document.object_name))
      })

  }, [profile])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 items-center gap-4 w-max">
      <h3 className="text-lg font-semibold col-span-full">Documents</h3>
      <>
        <div className="self-center">ID:</div><div>{profile?.approvals?.valid_id_pic_name ? (
          <DocumentLink document={profile?.approvals?.valid_id_pic_name} />
        ) : (
          <span className="text-gray-500">N/A</span>
        )}</div>
      </>
      <>
        <div className="self-center">Relevant Documents:</div><div className="flex flex-col lg:flex-row flex-wrap gap-2">{documents.length ? documents.map((name, idx) => (
          <Button key={idx} asChild variant="outline" className="justify-start">
            <Link
              target="_blank"
              href={getUrl(name)}
              className="space-x-2"
            >
              <ExternalLink size={16} />
              <span className="max-w-[100px] truncate">{name}</span>
            </Link>
          </Button>
        )) : "N/A"}</div>
      </>
    </div>
  )
}
