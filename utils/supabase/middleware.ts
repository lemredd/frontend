import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function redirectTo(path: string, request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = path
  return NextResponse.redirect(url)
}

export async function updateSession(request: NextRequest) {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } =
    process.env
  const isAuthRoute =
    request.nextUrl.pathname.startsWith('/auth/login') ||
    request.nextUrl.pathname.startsWith('/auth/join')
  let supabaseResponse = NextResponse.next({ request })

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

  // If user exists, check the profile completion status
  if (user) {
    if (request.nextUrl.pathname.startsWith('/auth')) {
      return redirectTo('/', request)
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('is_completed')
      .eq('user_id', user.id)
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }

    if (
      !data?.is_completed &&
      !request.nextUrl.pathname.startsWith('/user/setup')
    ) {
      return redirectTo('/user/setup/skills', request)
    }

    if (
      data?.is_completed &&
      request.nextUrl.pathname.startsWith('/user/setup')
    ) {
      return redirectTo('/', request)
    }
  }
  // If no user is logged in, redirect to the login page
  else if (!user) {
    if (!isAuthRoute) {
      return redirectTo('/auth/login', request)
    }
  }

  return supabaseResponse
}
