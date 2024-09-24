import { createClient } from '@/utils/supabase/client'

const isAuthenticated = async (): Promise<boolean> => {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    return !!user // Return true if user exists, otherwise false
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false // Return false in case of error
  }
}

export default isAuthenticated
