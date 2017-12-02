import { Router } from 'express'

import playerRouter from './players'

const apiRouter = Router()

apiRouter.get('/', (req, res) => {
  res.send('Api')
})

apiRouter.use('/players', playerRouter)

export default apiRouter