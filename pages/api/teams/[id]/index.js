import nc from 'next-connect'
import dbConnect from '../../../../config/dbConnect'
import {
  deleteSingleTeam,
  getSingleTeam,
  updateSingleTeam,
} from '../../../../controllers/teamController'
import onError from '../../../../middlewares/error'

const handler = nc({ onError })
dbConnect()

handler.get(getSingleTeam)
handler.put(updateSingleTeam)
handler.delete(deleteSingleTeam)

export default handler
