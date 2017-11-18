import { Router } from 'express'

const apiRouter = Router()

apiRouter.get('/', (req, res) => {
  res.send('APi')
})

export default apiRouter