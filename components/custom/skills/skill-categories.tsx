import { useState, useEffect } from "react"

import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface Props {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
}

export function SkillCategories({ setSelectedCategory }: Props) {
  const supabase = createClient()
  const [skillCategories, setSkillCategories] = useState<Record<string, any>[]>([])

  useEffect(() => {
    supabase
      .from("skill_categories")
      .select("id,name")
      .then(({ data }) => {
        setSkillCategories(data!)
      })
  }, [])

  return (
    <RadioGroup defaultValue="option-one" onValueChange={setSelectedCategory} className="">
      <Card>
        <CardHeader><h3 className="text-lg">Select a category</h3></CardHeader>
        <CardContent className="space-y-4">
          {skillCategories?.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <RadioGroupItem value={category.id} id={category.id} />
              <Label htmlFor={category.id}>{category.name}</Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </RadioGroup>
  )
}
