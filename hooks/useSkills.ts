import { useEffect, useState } from 'react'

import { ComboboxItem } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'

export function useSkills(
  supabase: ReturnType<typeof createClient>,
) {
  const [skills, setSkills] = useState<ComboboxItem[]>([])
  useEffect(() => {
    supabase
      .from('skills')
      .select('id,name')
      .order('name', { ascending: true })
      .range(0, 5)
      .then(({ data }) => {
        if (!data) return
        setSkills(
          data
            .map(({ id, name }) => ({ value: `${id}|${name}`, label: name })),
        )
      })
  }, [supabase])

  return { skills, setSkills }
}
