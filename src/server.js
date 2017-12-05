// global dependencies
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

// local dependencies
import './database'
import { PROTOCOL, HOST, PORT } from './config'
import { authMiddleware } from './middleware/authentication'
import apiRouter from './routing'

// create express server
const app = express()

// apply middlewares 
app.use(morgan('dev'))
// auth middleware only for api routes
app.use('/api/*', authMiddleware)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// serve public statc files -> api docs
app.use(express.static('out'))

// connect router to server
app.use('/api', apiRouter)

// display custom 404 page
app.use('*', (req, res) => {
  res.status(404).send('404 Error - Page not found!')
})

const host = HOST || 'localhost'
const port = PORT || 80
const protocol = PROTOCOL || 'http'

// start listening for incoming connections 
app.listen(port, () => console.log(`Listening on: ${protocol}://${host}:${port}`))

export default app