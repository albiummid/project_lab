import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect'
import { allProjects } from '../../../controllers/projectController'

const handler = nc()
dbConnect()

handler.get(allProjects)

export default handler
