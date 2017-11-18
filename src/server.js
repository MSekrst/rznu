import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import morgan from 'morgan'

import apiRouter from './routing'

const app = express()

app.use(morgan('dev'))

// connect router to server
app.use('/api', apiRouter)

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on: http://${host}:${port}`))