'use client'

import Spinner from '@/components/custom/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

interface Props {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
  className?: string
}

export function SkillCategories({ setSelectedCategory, className }: Props) {
  const supabase = createClient()
  const [skillCategories, setSkillCategories] = useState<
    Record<string, string>[]
  >([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    supabase
      .from('skill_categories')
      .select('id,name')
      .then(({ data }) => {
        setSkillCategories(data!)
        setLoading(false)
      })
  }, [])

  return (
    <Card className={cn(`h-full overflow-auto`, className)}>
      <CardHeader>
        <CardTitle className="text-lg">1. Select a Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <RadioGroup
            onValueChange={setSelectedCategory}
            className="space-y-2"
          >
            {skillCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-3"
              >
                <RadioGroupItem
                  value={category.id}
                  id={category.id}
                />
                <Label htmlFor={category.id}>{category.name}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  )
}
