import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = '/auth/verify/error'

  if (!(token_hash && type)) return NextResponse.redirect(redirectTo)

  const supabase = createClient()

  const { data, error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })
  if (error) return NextResponse.redirect(redirectTo)

  const roleCode = String(data?.user?.user_metadata?.role_code).toLocaleLowerCase()
  redirectTo.pathname = `/${roleCode}/setup`
}
