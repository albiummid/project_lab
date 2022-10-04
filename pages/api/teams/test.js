import nc from 'next-connect'
import { test } from '../../../controllers/teamController'
import onError from '../../../middlewares/error'

const handler = nc({ onError })

handler.get(test)

export default handler
