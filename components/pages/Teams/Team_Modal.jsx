import React, { useEffect, useState } from 'react'
import Modal from '../../UI/Modal'
import InputField from '../../ui/InputField'
import ColorPalette from '../../UI/ColorPalette'
import Button from '../../UI/Button'
import { useDispatch } from 'react-redux'
import {
  useAddTeamMutation,
  useEditTeamMutation,
} from '../../../app/features/teams/teamsAPI'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

export default function Team_Modal({
  onClose = () => {},
  open,
  defaultValues,
  isEditing,
}) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const [title, setTitle] = useState(defaultValues?.title || '')
  const [description, setDescription] = useState(
    defaultValues?.description || ''
  )
  const [color, setColor] = useState(defaultValues?.color || 'red')

  const [
    addTeam,
    { isError: isAddError, isSuccess: isAddSuccess, isLoading: isAddLoading },
  ] = useAddTeamMutation()

  const [
    updateTeam,
    {
      data: updateResponse,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
    },
  ] = useEditTeamMutation()

  const handleSubmit = async () => {
    if (isEditing) {
      try {
        await updateTeam({
          _id: defaultValues._id,
          data: {
            title,
            description,
            color,
          },
        })
        onClose()
        toast.success('Team updated !')
      } catch (err) {
        toast.error('Team is not updated !')
      }
    } else {
      try {
        if (!title || !description || !color) {
          return toast.error('All fields are required !')
        }
        await addTeam({
          title,
          description,
          color,
          members: [
            {
              user: user._id,
              isCreator: true,
            },
          ],
          createdBy: user._id,
        })

        onClose()
        toast.success('Team created successfully !')
      } catch (err) {}
    }
  }

  useEffect(() => {
    if (isAddSuccess) {
      setOpenModal(false)
      setColor('')
      setDescription('')
      setTitle('')
    }
    if (isAddError) {
      console.log('GOT an error..')
    }
  }, [isAddSuccess, isAddError])

  return (
    <Modal onClose={onClose} open={open} heading={'Add new team'}>
      <InputField
        onChange={(e) => {
          setTitle(e.value)
        }}
        name={'title'}
        type='text'
        placeholder={'Enter team name'}
        label='Team Name'
        defaultValue={title}
      />
      <InputField
        onChange={(e) => {
          setDescription(e.value)
        }}
        name={'description'}
        placeholder={'Write about your team'}
        label='Description'
        type='textarea'
        defaultValue={description}
      />
      <div>
        <h1 className='font-semibold'>Select Color</h1>
        <ColorPalette
          defaultValue={color}
          onChange={(e) => {
            setColor(e)
          }}
        />
      </div>

      <Button
        onClick={() => {
          handleSubmit()
        }}
        loading={isAddLoading}
      >
        Submit
      </Button>
    </Modal>
  )
}
