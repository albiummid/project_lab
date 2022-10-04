import React, { useState } from 'react'
import assets from '../../assets'
import { useDispatch, useSelector } from 'react-redux'
import { setKeywords } from '../../app/features/filters/filtersSlice'
import { DebounceHandler } from '../../utils/utils'
import Img from '../UI/IMG'
import Redirect from '../UI/Link'

export default function Navbar() {
  const [clicked, setClicked] = useState(false)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleChange = DebounceHandler((e) => {
    dispatch(setKeywords(e.target.value))
  }, 500)
  let avatar = user?.avatar?.url || assets.images.lws_logo.src
  // if (!user) return null
  return (
    <div className='flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75'>
      <img src={avatar} className='w-10 h-10 rounded-full' alt='' />
      <input
        className='flex items-center h-10 px-4 ml-10 text-sm bg-gray-200 rounded-full focus:outline-none focus:ring'
        type='search'
        placeholder='Search for anything…'
        onChange={handleChange}
      />
      <div className='ml-10'>
        <Redirect
          className='mx-2 text-sm font-semibold text-gray-600 hover:text-indigo-700'
          to={'/teams'}
        >
          Teams
        </Redirect>
        <Redirect
          to={'/projects'}
          className='mx-2 text-sm font-semibold text-indigo-700'
        >
          Projects
        </Redirect>
      </div>
      <div
        onClick={() => {
          setClicked(!clicked)
        }}
        className='relative ml-auto group'
      >
        <button className='flex items-center justify-center w-8 h-8 ml-auto overflow-hidden rounded-full cursor-pointer '>
          <img src={user?.avatarURL} alt='' />
        </button>
        {clicked && (
          <>
            <div className='absolute top-10 right-0 bg-white shadow-md  text-sm space-y-2 py-2 '>
              <p className=' cursor-pointer  px-5'>{user?.name}</p>
              <p
                className=' cursor-pointer hover:bg-violet-400 px-5'
                onClick={() => {}}
              >
                {' '}
                Logout
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
