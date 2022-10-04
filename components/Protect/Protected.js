import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { authApi, useLoadUserDataQuery } from '../../app/features/auth/authApi'
import { isEmpty } from '../../utils/utils'
import Spinner from '../UI/Spinner'

export default function Protected(Component, role, redirect) {
  const AuthenticatedComponent = () => {
    const session = useSession()
    let { status } = session
    const {
      data: res,
      isLoading,
      isSuccess,
      isError,
      error,
    } = useLoadUserDataQuery()
    const { user } = useSelector((state) => state.user)
    const router = useRouter()
    let path = router.pathname

    const Render = () => {
      if (status === 'loading') return <Spinner />

      if (status === 'authenticated') {
        return (
          <>
            <Component
              data={{
                path,
                user,
              }}
            />
          </>
        )
      } else {
        null
      }
    }
    return (
      <>
        <Render />
      </>
    )
  }
  return AuthenticatedComponent
}
