import nc from 'next-connect'
import { allTeams, newTeam } from '../../../controllers/teamController'
import onError from '../../../middlewares/error'

const handler = nc({ onError })

handler.post(newTeam)

handler.get(allTeams)

export default handler
