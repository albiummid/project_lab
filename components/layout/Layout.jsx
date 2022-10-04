import Head from 'next/head'
import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { ToastContainer } from 'react-toastify'
import { getSession, useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

export default function Layout({ children, title }) {
  const dispatch = useDispatch()
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{title?.length > 0 ? title + ' -' : ''} TeamLab</title>
      </Head>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div>
        <div className='flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200'>
          <Navbar />
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
