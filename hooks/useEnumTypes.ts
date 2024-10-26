import { useState } from "react"

import { ComboboxItem } from "@/lib/types"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export function useJobSetups() {
  const [setups, setSetups] = useState<ComboboxItem[]>([])

  function getSetups() {
    supabase
      .rpc('get_types', { enum_type: 'job_setup' })
      .then(({ data, error }) => {
        if (error) return console.error(error)
        setSetups(data.map((item: string) => ({ label: `${item[0].toLocaleUpperCase()}${item.slice(1)}`, value: item })))
      })
  }

  return { setups, getSetups }
}
