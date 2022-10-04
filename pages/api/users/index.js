import nc from 'next-connect'
import { getUsers } from '../../../controllers/userController'
import { isAuthenticatedUser } from '../../../middlewares/auth'
import onError from '../../../middlewares/error'

const handler = nc({ onError })

handler.get(getUsers)
// handler.use(isAuthenticatedUser).get(getUsers)

export default handler
