import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  useAddTeamMemberMutation,
  useDeleteTeamMemberMutation,
} from '../../../app/features/teams/teamsAPI'

import Modal from '../../UI/Modal'
import { toast } from 'react-toastify'

import InputField from '../../ui/InputField'
import { useClickAway } from 'react-use'
import Button from '../../UI/Button'
import Image from 'next/image'
import { useGetUsersQuery } from '../../../app/features/users/usersApi'
export default function MemberModal({
  open,
  onClose,
  teamId,
  members,
  status,
}) {
  const [query, setQuery] = useState(null)
  const [queryBy, setQueryBy] = useState('email')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const dropRef = useRef(null)

  const { data, isError, isLoading, isSuccess } = useGetUsersQuery(query, {
    skip: !query || Object.values(query).length === 0,
  })
  const [selectedUser, setSelectedUser] = useState(null)
  const [keyword, setKeyword] = useState('')

  const [addTeamMember, { isLoading: addMemberLoading }] =
    useAddTeamMemberMutation()
  const [removeTeamMember, { isLoading: removeMemberLoading }] =
    useDeleteTeamMemberMutation()

  const handleAddMember = async () => {
    if (!selectedUser) {
      return toast.error('Please select an user !')
    }
    const res = await addTeamMember({
      teamId,
      memberId: selectedUser._id,
    })

    if (res.data.success) {
      toast.success(res.data.message)
      setSelectedUser(null)
      onClose()
    }
  }
  const handleRemoveMember = async () => {
    if (!selectedUser) {
      return toast.error('Please select an user !')
    }
    const res = await removeTeamMember({
      teamId,
      memberId: selectedUser._id,
    })

    if (res.data.success) {
      toast.success(res.data.message)
      setSelectedUser(null)
      onClose()
    }
  }
  const [openSelect, setOpenSelect] = useState(false)
  const handleChange = async (e) => {
    if (e.value === '') {
      return setOpenSelect(false)
    }
    let query = { [queryBy]: e.value }
    setQuery(query)
    setOpenSelect(true)
  }

  useClickAway(dropRef, () => {
    setOpenSelect(false)
  })

  let queryData = data?.users?.filter((user) => {
    return (
      members.findIndex((member) => {
        return member.user.email === user.email
      }) === -1
    )
  })
  const [removeQuery, setRemoveQuery] = useState([])

  useEffect(() => {
    setRemoveQuery(
      members
        .slice()
        .filter((m) =>
          m.user[queryBy].toLowerCase().trim().includes(keyword.toLowerCase())
        )
    )
  }, [keyword, members, queryBy])

  const UserCard = ({ image, name, email }) => {
    return (
      <div className='flex items-center space-x-2 border border-dashed p-2'>
        <Image
          src={image}
          alt=''
          width={36}
          height={36}
          className='rounded-full'
        />
        <div className='flex flex-col'>
          <span> Name: {name}</span>
          <span> Email: {email}</span>
        </div>
      </div>
    )
  }

  return (
    <section>
      {status === 'add' ? (
        <Modal
          open={open}
          onClose={onClose}
          isDefault
          heading={'Add Team Member'}
        >
          <div className='flex space-x-2'>
            <p>Search By : </p>{' '}
            <div className='flex space-x-4'>
              <div>
                <input
                  checked={queryBy === 'email'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQueryBy('email')
                    }
                  }}
                  type='radio'
                  name='email'
                  id=''
                />
                <label htmlFor='email'>Email</label>
              </div>
              <div>
                <input
                  checked={queryBy === 'name'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQueryBy('name')
                    }
                  }}
                  type='radio'
                  name='name'
                  id=''
                />
                <label htmlFor='name'>Name</label>
              </div>
            </div>
          </div>
          <div className='relative'>
            {selectedUser !== null && (
              <div>
                <h1 className=' font-bold'>User Selected :</h1>
                <UserCard
                  name={selectedUser.name}
                  email={selectedUser.email}
                  image={selectedUser.avatar.url}
                />
              </div>
            )}
            <InputField
              placeholder={`Type ${queryBy} here`}
              onChange={handleChange}
              isError={!queryData?.length && openSelect}
              error={'No user found!'}
            />
            {openSelect && (
              <div
                ref={dropRef}
                className=' space-y-1 absolute w-full bg-white'
              >
                {queryData?.map((user) => (
                  <div
                    onClick={() => {
                      setOpenSelect(false)
                      setSelectedUser(user)
                    }}
                    className='bg-white flex flex-col hover:bg-gray-400/30 cursor-pointer p-2'
                    key={user._id}
                  >
                    <UserCard
                      name={user.name}
                      email={user.email}
                      image={user.avatar.url}
                    />
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={() => {
                handleAddMember()
              }}
              disabled={isLoading || error.length || addMemberLoading}
            >
              Add
            </Button>

            {error?.length > 0 && (
              <div>
                <p className='text-red-400 bg-red-100 p-2'>{error}</p>
              </div>
            )}
          </div>
        </Modal>
      ) : status === 'remove' ? (
        <Modal
          open={open}
          onClose={onClose}
          isDefault
          heading={'Remove Team Member'}
        >
          <div className='flex space-x-2'>
            <p>Search By : </p>{' '}
            <div className='flex space-x-4'>
              <div>
                <input
                  checked={queryBy === 'email'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQueryBy('email')
                    }
                  }}
                  type='radio'
                  name='email'
                  id=''
                />
                <label htmlFor='email'>Email</label>
              </div>
              <div>
                <input
                  checked={queryBy === 'name'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQueryBy('name')
                    }
                  }}
                  type='radio'
                  name='name'
                  id=''
                />
                <label htmlFor='name'>Name</label>
              </div>
            </div>
          </div>
          <div className='relative'>
            {selectedUser !== null && (
              <div>
                <h1 className=' font-bold'>User Selected :</h1>
                <UserCard
                  name={selectedUser.name}
                  email={selectedUser.email}
                  image={selectedUser.avatar.url}
                />
              </div>
            )}
            <InputField
              placeholder={`Type ${queryBy} here`}
              onChange={(e) => {
                setKeyword(e.value)
              }}
              isError={!queryData?.length && openSelect}
              error={'No user found!'}
            />
            {
              <div
                ref={dropRef}
                className=' space-y-1  w-full bg-white overflow-auto max-h-60'
              >
                {removeQuery?.map((member) => {
                  console.log(member, 'mem..')
                  let user = member.user
                  return (
                    <div
                      onClick={() => {
                        setSelectedUser(user)
                      }}
                      className='bg-white flex flex-col hover:bg-gray-400/30 cursor-pointer p-2'
                      key={user._id}
                    >
                      <UserCard
                        name={user.name}
                        email={user.email}
                        image={user.avatar.url}
                      />
                    </div>
                  )
                })}
              </div>
            }

            <Button
              onClick={() => {
                handleRemoveMember()
              }}
              disabled={isLoading || error.length || removeMemberLoading}
            >
              Remove
            </Button>

            {error?.length > 0 && (
              <div>
                <p className='text-red-400 bg-red-100 p-2'>{error}</p>
              </div>
            )}
          </div>
        </Modal>
      ) : null}
    </section>
  )
}
