import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } =
    process.env
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const supabase = createServerClient(
    NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role_code = user?.user_metadata?.role_code

  const Redirect = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.redirect(url)
  }

  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_completed')
      .eq('user_id', user.id)
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }

    if (isAuthRoute) {
      if (!request.url.includes('logout')) return Redirect('/')
    }

    switch (role_code) {
      case 'seeker':
        if (!request.nextUrl.pathname.startsWith('/skr')) {
          // TODO: FIX
        }
        if (
          !profile?.is_completed &&
          !request.nextUrl.pathname.startsWith('/skr/setup')
        ) {
          return Redirect('/skr/setup/skills')
        }
        if (
          profile?.is_completed &&
          request.nextUrl.pathname.startsWith('/skr/setup')
        ) {
          return Redirect('/skr')
        }
        break

      // TODO: ADD FOR PROVIDER
      case 'provider':
        if (!request.nextUrl.pathname.startsWith('/pdr')) {
          return Redirect('/pdr')
        }
        break

      // TODO: ADD FOR ADMIN
      case 'admin':
        if (!request.nextUrl.pathname.startsWith('/admin')) {
          return Redirect('/admin')
        }
        break

      default:
        // TODO: GIVE DEFAULT
        break
    }
  }

  // If no user is logged in, redirect to login page unless it's an auth route
  if (!user && !isAuthRoute) {
    return Redirect('/auth/login')
  }

  return supabaseResponse
}
