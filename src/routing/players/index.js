import { Router } from 'express'
import { getDbConnection, isValidId, getIdObject } from '../../database'

const playerRouter = Router()

const databaseCollectionName = 'players'

/**
 * @api {get} api/players/ Get players
 * @apiName GetPlayer
 * @apiGroup Player
 * @apiHeader authorization Basic authorization value
 * @apiVersion 1.0.0
 *
 * @apiSuccess {array} players List of players
 */
playerRouter.get('/', (req, res) => {
  const db = getDbConnection()

  db
    .collection(databaseCollectionName)
    .find({})
    .toArray((err, players) => {
      return err ? res.status(500).json(err) : res.status(200).json(players)
    })
})

/**
 * @api {put} api/players/ Create new player
 * @apiName CreatePlayer
 * @apiGroup Player
 * @apiHeader authorization Basic authorization value
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} name Player name
 * @apiParam {number} number Player number
 */
playerRouter.put('/', (req, res) => {
  const db = getDbConnection()

  db.collection(databaseCollectionName).insert(req.body, (err, data) => {
    return err ? res.status(500).json(err) : res.status(201).json({ id: data.insertedIds[0] })
  })
})

/**
 * @api {put} api/players/:id Update player
 * @apiName UpdatePlayer
 * @apiGroup Player
 * @apiHeader authorization Basic authorization value
 * @apiVersion 1.0.0
 * 
 * @apiParam {string} Player ID.
 * @apiParam {String} [name] Player name
 * @apiParam {number} [number] Player number
 */
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

/**
 * @api {delete} api/players/:id Delete player
 * @apiName DeletePlayer
 * @apiGroup Player
 * @apiHeader authorization Basic authorization value
 * @apiVersion 1.0.0
 * 
 * @apiParam {string} Player ID
 */
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
