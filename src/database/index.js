import { MongoClient, ObjectID } from 'mongodb'
import { DATABASE_URL, AUTH_DATABASE_URL } from '../config'

let dbSingleton

MongoClient.connect(DATABASE_URL, (err, db) => {
  if (err) {
    console.error('Error while connecting to the database!')

    return err
  }

  console.log('Successfuly connected to the database!')

  dbSingleton = db

  return
})

let authDbSingleton

MongoClient.connect(AUTH_DATABASE_URL, (err, db) => {
  if (err) {
    console.error('Error while connecting to the auth database!')

    return err
  }

  console.log('Successfuly connected to the auth database!')

  authDbSingleton = db

  return
})

export const getDbConnection = () => dbSingleton

export const getAuthDbConnection = () => authDbSingleton

export const isValidId = id => ObjectID.isValid(id)

export const getIdObject = id => new ObjectID(id)