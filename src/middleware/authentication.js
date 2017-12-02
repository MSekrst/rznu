import auth from 'basic-auth'
import { getAuthDbConnection } from '../database'

const databaseUsersCollection = 'users'

export const authMiddleware = (req, res, next) => {
  const authObject = auth(req)

  console.log(authObject)

  if (!authObject) {
    return res.status(401).end()
  }

  const authDb = getAuthDbConnection()

  authDb.collection(databaseUsersCollection).findOne(authObject, (err, user) => {
    if (err) {
      return res.status(500).json(err)
    }

    return user ? next() : res.status(401).end()
  })
}
