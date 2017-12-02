import { Router } from 'express'
import { getDbConnection, isValidId, getIdObject } from '../database/index'

const playerRouter = Router()

const databaseCollectionName = 'players'

playerRouter.get('/', (req, res) => {
  const db = getDbConnection()

  db
    .collection(databaseCollectionName)
    .find({})
    .toArray((err, players) => {
      return err ? res.status(500).json(err) : res.status(200).json(players)
    })
})

playerRouter.put('/', (req, res) => {
  const db = getDbConnection()

  db.collection(databaseCollectionName).insert(req.body, (err, data) => {
    return err ? res.status(500).json(err) : res.status(201).json({ id: data.insertedIds[0] })
  })
})

playerRouter.put('/:id', (req, res, next) => {
  if (!isValidId(req.params.id)) {
    // return next middleware if route parameter is not valid ID
    return next()
  }

  const _id = getIdObject(req.params.id)
  const db = getDbConnection()

  db.collection(databaseCollectionName).updateOne({ _id }, { $set: req.body }, (err, data) => {
    if (err) {
      return res.status(500).json(err)
    }

    return data.matchedCount ? res.status(204).end() : res.status(404).json('No match for given id!')
  })
})

playerRouter.delete('/:id', (req, res, next) => {
  if (!isValidId(req.params.id)) {
    // return next middleware if route parameter is not valid ID
    return next()
  }

  const _id = getIdObject(req.params.id)
  const db = getDbConnection()

  db.collection(databaseCollectionName).deleteOne({ _id }, (err, data) => {
    if (err) {
      return res.status(500).json(err)
    }

    return data.deletedCount ? res.status(204).end() : res.status(404).json('No match for given id!')
  })
})

export default playerRouter
