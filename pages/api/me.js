import nc from 'next-connect'
import dbConnect from '../../config/dbConnect'
import { currentUserProfile } from '../../controllers/userController'
import { isAuthenticatedUser } from '../../middlewares/auth'
import onError from '../../middlewares/error'

const handler = nc({ onError })
dbConnect()

handler.use(isAuthenticatedUser).get(currentUserProfile)

export default handler
