import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { getSession } from 'next-auth/react'

export async function middleware(req) {
  // const session = await getSession({ req })
  // console.log(session, 'session...')
  // switch (req.nextUrl.pathname) {
  //   case '/': {
  //     const url = req.nextUrl.clone()
  //     url.pathname = '/login'
  //     return NextResponse.rewrite(url)
  //   }
  //   default:
  //     null
  // }
  // const session = await getToken({
  //   req,
  //   secret: process.env.JWT_SECRET,
  //   secureCookie: process.env.NODE_ENV === 'production',
  // })
  // // You could also check for any property on the session object,
  // // like role === "admin" or name === "John Doe", etc.
  // if (!session) return NextResponse.redirect('/home')
  // // If user is authenticated, continue.
}
