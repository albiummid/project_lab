import React from 'react'
import Teams from '../components/pages/Teams/Teams'
import Protected from '../components/Protect/Protected'

function teams() {
  return <Teams />
}

export default Protected(Teams)
