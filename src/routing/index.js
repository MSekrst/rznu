import { Router } from 'express'

import playerRouter from './players'
import teamRouter from './teams'

const apiRouter = Router()

apiRouter.use('/players', playerRouter)
apiRouter.use('/teams', teamRouter)

export default apiRouter