import nc from 'next-connect'
import {
  addTeamMember,
  removeTeamMember,
} from '../../../../../controllers/teamController'
import dbConnect from '../../../../../config/dbConnect'

import onError from '../../../../../middlewares/error'

const handler = nc({ onError })
dbConnect()

handler.post(addTeamMember)
handler.delete(removeTeamMember)

export default handler
