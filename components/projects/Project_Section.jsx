/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  projectsAPI,
  useAddProjectMutation,
  useGetProjectsQuery,
} from '../../app/features/projects/projectsAPI'
import { useGetTeamsQuery } from '../../app/features/teams/teamsAPI'
import Modal from '../layout/Modal'
import { useDrop } from 'react-dnd'
import ProjectCard from './Project_Card'
import { ItemTypes } from '../../utils/constants'
import { apiSlice } from '../../app/features/api/apiSlice'

export default function ProjectSection({ section_name = 'Backlog' }) {
  const [openModal, setOpenModal] = useState(false)
  const [team, setTeam] = useState({})
  const { user } = useSelector((state) => state.auth)
  const [desc, setDesc] = useState('')
  const { data: teams } = useGetTeamsQuery(user.email)
  const [addProject, { data: addProjectData, isSuccess: addSuccess }] =
    useAddProjectMutation()

  const [project_count, setProjectCount] = useState(0)

  const { data: projects, isError } = useGetProjectsQuery({
    stage: section_name,
    email: user.email,
  })

  const handleAddProject = () => {
    if (!desc.length || !team?.id) {
      console.log(desc, team)
      return alert('Desc and team required')
    }
    const data = {
      description: desc,
      stage: 'Backlog',
      team,
      emails: team.emails,
      createdBy: user.email,
      createdAt: Date.now(),
    }
    addProject(data)
  }

  useEffect(() => {
    if (addSuccess) {
      setOpenModal(false)
      setDesc('')
      setTeam(null)
    }
    setProjectCount(projects?.length || 0)
  }, [addSuccess, projects])

  const dispatch = useDispatch()

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      dispatch(
        projectsAPI.endpoints.editProject.initiate({
          id: item.id,
          data: {
            stage: section_name,
          },
        })
      )
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop}
      className={`flex flex-col flex-shrink-0 w-72  shadow-md rounded-md min-h-[70vh] px-2 ${
        isOver ? 'bg - white / 30' : 'bg-white/10'
      } `}
    >
      <div className='flex items-center flex-shrink-0 h-10 px-2'>
        <span className='block text-sm font-semibold'>{section_name}</span>
        <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
          {project_count}
        </span>

        {/* Project Creator ==> Only for Backlog section */}
        <>
          {section_name === 'Backlog' && (
            <button
              onClick={() => {
                setOpenModal(true)
              }}
              className='flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                ></path>
              </svg>
            </button>
          )}
        </>
      </div>
      <div className='flex flex-col pb-2 overflow-auto'>
        {projects?.map((item, key) => (
          <ProjectCard key={key} {...item} />
        ))}
      </div>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
      >
        <div className='p-5'>
          <h1>Add Project</h1>
          <textarea
            type='text'
            placeholder='Project Desc'
            onChange={(e) => setDesc(e.target.value)}
          />
          <select
            onChange={(e) => {
              let _id = e.target.value
              let t = teams?.find((i) => i.id == _id)
              setTeam(t)
            }}
            name=''
            id=''
          >
            {!team?.id && (
              <option value={''} title='Select team'>
                Select Team
              </option>
            )}
            {teams?.map((item) => (
              <option
                key={item.id}
                value={item.id}
                onClick={() => console.log('first')}
              >
                <span onClick={() => setTeam(item)}>{item.title}</span>
              </option>
            ))}
          </select>
          <div>
            <button
              onClick={() => {
                handleAddProject()
              }}
              className='my-2 border'
            >
              Add Project..
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
