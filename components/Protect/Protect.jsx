import { getSession } from 'next-auth/react'
import React from 'react'

export default function Protect({ children }) {
  return <>{children}</>
}
export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req })
    console.log(session, 'session...')

    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }
  } catch (err) {
    console.log(err)
    if (err.error.status === 401) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }
  }

  return {
    props: {},
  }
}
