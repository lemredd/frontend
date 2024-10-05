"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

interface Props {
  content: React.ReactNode
}

export function CollapsibleDesc({ content }: Props) {
  const [collapsed, setCollapsed] = useState(true)
  const descriptionClassName = () => (
    `whitespace-pre-line ${collapsed
      ? 'line-clamp-3'
      : 'line-clamp-0'}
    `
  )

  return (
    <div>
      <p className={descriptionClassName()}>{content}</p>
      <Button variant="link" className="p-0 -mt-2" onClick={() => setCollapsed(!collapsed)}>See {collapsed ? 'more' : 'less'}</Button>
    </div>
  )
}
