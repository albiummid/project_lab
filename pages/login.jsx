import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { authApi, useRegisterMutation } from '../app/features/auth/authApi'

import { toast } from 'react-toastify'
import assets from '../assets'
import Img from '../components/UI/IMG'
import { FiUploadCloud } from 'react-icons/fi'
import InputField from '../components/ui/InputField'
import { useSession, signIn, signOut } from 'next-auth/react'
import { isEmpty } from '../utils/utils'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Spinner from '../components/UI/Spinner'
export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const fileRef = useRef(null)
  const { user } = useSelector((state) => state.user)
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    avatarURL: false,
  })

  const [avatar, setAvatar] = useState(null)

  const [register, { data: registerData, isLoading, error: responseError }] =
    useRegisterMutation()
  const router = useRouter()
  const dispatch = useDispatch()
  const { status } = useSession()
  const login = async () => {
    const { email, password } = data
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (res.ok) {
      console.log(res, 'res')
      dispatch(authApi.endpoints.loadUserData.initiate())
      router.push('/teams')
    }
  }
  const [count, setCount] = useState(6)
  useEffect(() => {
    if (registerData) {
      login()
    }
  }, [registerData])

  useEffect(() => {
    let timerId
    let counterTimer
    if (status === 'authenticated') {
      dispatch(authApi.endpoints.loadUserData.initiate())
      timerId = setTimeout(() => {
        router.push('/teams')
      }, 6000)
      // counterTimer = setTimeout(() => {
      //   setCount((prv) => prv - 1)
      // }, 1000)
    }
    return () => {
      clearTimeout(timerId)
      // clearTimeout(counterTimer)
    }
  }, [status, , dispatch, router])

  const handleSubmit = async (e) => {
    const { email, password, name } = data
    e.preventDefault()

    if (isLogin) {
      if (!email || !password) return console.log('ERROR')
      await login()
    } else {
      if (!name || !email || !password || !avatar) {
        return toast.error('All fields are required !')
      }
      register({
        name,
        email,
        password,
        avatar,
      })
    }
  }

  const handleChange = (e) => {
    setErrors((prv) => {
      return {
        ...prv,
        [e.name]: false,
      }
    })
    setData((prv) => {
      return {
        ...prv,
        [e.name]: e.value,
      }
    })
  }

  return (
    <main className='grid place-items-center h-screen bg-[#F9FAFB'>
      {status === 'authenticated' ? (
        <>
          <section className=' space-y-10 text-center'>
            <h1 className='text-5xl'>You are already logged in .</h1>
            <p>
              You have been redirected to team page within {count} second...
            </p>
          </section>
        </>
      ) : (
        <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-md w-full space-y-8'>
            <div>
              <img
                className='mx-auto w-12 h-12 '
                src={isEmpty(avatar) ? assets.images.lws_logo.src : avatar}
                alt='Learn with sumit'
              />
              <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                {isLogin ? 'Sign in to your account' : 'Create an account '}
              </h2>
            </div>

            <form className='mt-8 space-y-6'>
              <input type='hidden' name='remember' defaultValue='true' />

              <>
                {isLogin ? (
                  <div className=' shadow-sm space-y-2'>
                    <InputField
                      onChange={handleChange}
                      type={'email'}
                      name={'email'}
                      placeholder={'Enter email address'}
                      defaultValue={data.email}
                    />
                    <InputField
                      onChange={handleChange}
                      type={'password'}
                      name={'password'}
                      placeholder={'Give a strong password'}
                      defaultValue={data.password}
                    />
                  </div>
                ) : (
                  <div className=' shadow-sm space-y-2'>
                    <InputField
                      onChange={handleChange}
                      type={'text'}
                      name={'name'}
                      placeholder={'Enter your name '}
                      defaultValue={data.name}
                    />
                    <InputField
                      onChange={handleChange}
                      type={'email'}
                      name={'email'}
                      placeholder={'Enter your email address '}
                      defaultValue={data.email}
                    />
                    <InputField
                      onChange={handleChange}
                      type={'password'}
                      name={'password'}
                      placeholder={'Give a strong password'}
                      defaultValue={data.password}
                    />
                    <InputField
                      onChange={handleChange}
                      type={'password'}
                      name={'confirmPassword'}
                      placeholder={'Confirm your password'}
                      defaultValue={data.confirmPassword}
                    />
                    <input
                      type='file'
                      onChange={(e) => {
                        if (Array.from(e.target.files).length) {
                          const reader = new FileReader()
                          reader.readAsDataURL(e.target.files[0])
                          reader.onload = () => {
                            if (reader.readyState === 2) {
                              setAvatar(reader.result)
                            }
                          }
                        }
                      }}
                      accept='image/*'
                      hidden
                      ref={fileRef}
                    />
                    <div
                      className='bg-white w-full rounded-md p-2 flex justify-center items-center space-x-2 text-xs cursor-pointer '
                      onClick={() => {
                        fileRef.current.click()
                      }}
                    >
                      {avatar !== null ? (
                        <span>Change Avatar</span>
                      ) : (
                        <span>Upload Avatar</span>
                      )}
                      <FiUploadCloud />
                    </div>
                  </div>
                )}
              </>
              <a
                onClick={(e) => {
                  e.preventDefault()
                  setIsLogin((prv) => !prv)
                }}
                className='hover:underline hover:text-violet-500  text-xs cursor-pointer '
              >
                <span className='ml-auto'>
                  {isLogin
                    ? '   Not have an account ?'
                    : 'Already have an account ?'}
                </span>
              </a>

              <div className='w-full flex flex-col'>
                <button
                  disabled={isLoading}
                  onClick={(e) => {
                    handleSubmit(e)
                  }}
                  className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500'
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
                {isLoading && <Spinner className={'!h-5 w-5'} />}
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
