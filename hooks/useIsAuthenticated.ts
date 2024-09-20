import { createClient } from '@/utils/supabase/server'

const isAuthenticated = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  return true
}

export default isAuthenticated
