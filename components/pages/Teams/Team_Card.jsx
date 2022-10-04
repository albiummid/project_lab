import moment from 'moment/moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Options from '../../UI/Options'
import Team_Card_Modal from './Member_Modal'
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
} from 'react-icons/ai'
import { ImExit } from 'react-icons/im'
import Team_Modal from './Team_Modal'
import { useDeleteTeamMutation } from '../../../app/features/teams/teamsAPI'
import { toast } from 'react-toastify'
import { CalenderIcon } from '../../../assets'
import { Popover } from 'antd'
import Image from 'next/image'
import MemberModal from './Member_Modal'

export default function TeamCard({
  _id,
  title,
  description,
  color,
  members,
  createdAt,
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isMatched, setIsMatched] = useState(false)
  const { keywords } = useSelector((state) => state.filters)
  const { user } = useSelector((state) => state.user)
  const [isOwner, setIsOwner] = useState(false)

  const [deleteTeam] = useDeleteTeamMutation()

  useEffect(() => {
    members.forEach((member) => {
      if (member.user._id === user._id) {
        setIsOwner(member.isCreator)
      }
    })
  }, [members, user])

  useEffect(() => {
    if (
      keywords?.length > 0 &&
      description.toLowerCase().includes(keywords?.toLowerCase())
    ) {
      setIsMatched(true)
    } else {
      setIsMatched(false)
    }
  }, [keywords, description])

  const titleColors = {
    red: 'text-red-400 bg-red-100',
    cyan: 'text-cyan-400 bg-cyan-100',
    green: 'text-green-400 bg-green-100',
    amber: 'text-amber-400 bg-amber-100',
    orange: 'text-orange-400 bg-orange-100',
    teal: 'text-teal-400 bg-teal-100',
    sky: 'text-sky-400 bg-sky-100',
    purple: 'text-purple-400 bg-purple-100',
    violet: 'text-violet-400 bg-violet-100',
    blue: 'text-blue-400 bg-blue-100',
    yellow: 'text-yellow-400 bg-yellow-100',
    amber: 'text-amber-400 bg-amber-100',
  }

  const optionItems = [
    {
      title: 'Edit',
      icon: <AiOutlineEdit />,
      action: () => {
        setIsEditing(true)
      },
    },
    {
      title: 'Delete',
      icon: <AiOutlineDelete />,
      action: async () => {
        try {
          await deleteTeam(_id)
          toast.success('Deleted successfully')
        } catch (err) {
          toast.error("Couldn't delete the team !")
        }
      },
      danger: true,
    },
    {
      title: 'Leave',
      icon: <ImExit />,
      action: () => {
        console.log('Deleting')
      },
    },
    {
      title: 'Add ',
      icon: <AiOutlineUserAdd />,
      action: () => {
        setIsAdding(true)
      },
    },
    {
      title: 'Remove ',
      icon: <AiOutlineUserDelete />,
      action: () => {
        setIsRemoving(true)
      },
      danger: true,
    },
  ].filter((item) => {
    if (isOwner) {
      return item.title !== 'Leave'
    } else {
      return (
        item.title !== 'Delete' ||
        item.title !== 'Remove ' ||
        item.title !== 'Add '
      )
    }
  })

  return (
    <div
      className={`relative flex flex-col h-fit   p-4 my-3 bg-white rounded-lg
       cursor-pointer bg-opacity-90 group hover:bg-opacity-100 duration-300  ${
         isMatched && 'border-2 border-dashed border-rose-300 scale-105'
       }`}
    >
      <section className='relative w-full'>
        <Options options={optionItems} />
      </section>

      <p
        className={` ${titleColors[color]} font-semibold w-fit h-fit py-1 px-2 rounded-xl text-sm flex items-center`}
      >
        {title}
      </p>
      <h4 className='mt-3 h-full text-sm font-medium'>{description}</h4>
      <div className='flex items-center w-full mt-3 text-xs font-medium text-gray-400 flex-wrap mx-2 justify-between '>
        <div className='flex items-center '>
          <CalenderIcon />
          <span className='ml-1 leading-none'>
            {moment(createdAt).format('MMMM DD')}
          </span>
        </div>
        <div>
          {members.map((member) => (
            <Popover
              showArrow
              content={<div>{member.user.name}</div>}
              key={member._id}
            >
              <Image
                src={member.user.avatar.url}
                alt=''
                width={20}
                height={20}
                className='rounded-full'
              />
            </Popover>
          ))}
        </div>
      </div>
      <MemberModal
        teamId={_id}
        members={members}
        open={isAdding || isRemoving}
        onClose={() => {
          setIsAdding(false)
          setIsRemoving(false)
        }}
        status={isAdding ? 'add' : isRemoving ? 'remove' : 'idle'}
      />
      <Team_Modal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        defaultValues={{
          _id,
          title,
          description,
          color,
        }}
        isEditing
      />
    </div>
  )
}
