import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import TeamCard from './Team_Card'

import { PlusIcon } from '../../../assets'
import Team_Modal from './Team_Modal'
import { useGetTeamsQuery } from '../../../app/features/teams/teamsAPI'

function Teams() {
  const [openModal, setOpenModal] = useState(false)
  const { user } = useSelector((state) => state.user)
  const { keywords } = useSelector((state) => state.filters)
  const { data, isLoading, isError } = useGetTeamsQuery(user?._id)
  const [teams, setTeams] = useState([])

  // For getting filtered data at first =>
  useEffect(() => {
    if (keywords?.length) {
      let matched = data?.teams?.filter((t) =>
        t.description.toLowerCase().includes(keywords)
      )
      let unMatched = data.teams?.filter(
        (t) => !t.description.toLowerCase().includes(keywords)
      )
      setTeams([...matched, ...unMatched])
    } else {
      setTeams(data?.teams || [])
    }
  }, [data, keywords])

  return (
    <>
      <main className='min-h-[80vh]'>
        <div className='px-10 mt-6 flex justify-between '>
          <h1
            // onClick={() => dispatch(setKeywords('Hellow'))}
            className='text-2xl font-bold'
          >
            Teams
          </h1>
          <button
            onClick={() => setOpenModal(true)}
            className='flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100'
          >
            <PlusIcon />
          </button>
        </div>
        {teams?.length > 0 && (
          <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-10 mt-4 gap-6 overflow-auto'>
            {teams?.map((item) => (
              <TeamCard key={item.id} {...item} />
            ))}
          </section>
        )}

        <Team_Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false)
          }}
        />
      </main>
    </>
  )
}

export default Teams
