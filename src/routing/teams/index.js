import { Router } from 'express'
import { getDbConnection, isValidId, getIdObject } from '../../database'

const teamRouter = Router()

const databaseCollectionName = 'teams'

/**
 * @api {get} api/teams/ Get teams
 * @apiName GetTeams
 * @apiGroup Team
 * @apiHeader authorization Basic authorization value.
 *
 * @apiSuccess / {array} List of teams.
 */
teamRouter.get('/', (req, res) => {
  const db = getDbConnection()

  db
    .collection(databaseCollectionName)
    .find({})
    .toArray((err, teams) => {
      return err ? res.status(500).json(err) : res.status(200).json(teams)
    })
})

/**
 * @api {put} api/teams/ Create new team
 * @apiName CreateTeam
 * @apiGroup Team
 * @apiHeader authorization Basic authorization value.
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} name Team name
 * @apiParam {String} city Team home city
 */
teamRouter.put('/', (req, res) => {
  const db = getDbConnection()

  db.collection(databaseCollectionName).insert(req.body, (err, data) => {
    return err ? res.status(500).json(err) : res.status(201).json({ id: data.insertedIds[0] })
  })
})

/**
 * @api {put} api/teams/:id Update team
 * @apiName UpdateTeam
 * @apiGroup Team
 * @apiHeader authorization Basic authorization value.
 * @apiVersion 1.0.0
 * 
 * @apiParam {string} Team ID.
 * @apiParam {String} [name] Team name
 * @apiParam {String} [number] Team city
 */
teamRouter.put('/:id', (req, res, next) => {
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
 * @api {delete} api/teams/:id Delete team
 * @apiName DeleteTeam
 * @apiGroup Team
 * @apiHeader authorization Basic authorization value.
 * @apiVersion 1.0.0
 * 
 * @apiParam {string} Team ID.
 */
teamRouter.delete('/:id', (req, res, next) => {
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



export default teamRouter
