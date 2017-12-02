const environment = process.env.NODE_ENV

let databaseUrl
switch (environment) {
  case 'test':
    databaseUrl = 'mongodb://localhost:27017/rznu-lab1-test'
    break
  case 'production':
    databaseUrl = 'mongodb://localhost:27017/rznu-lab1-prod'
  default:
    databaseUrl = 'mongodb://localhost:27017/rznu-lab1'
    break
}

export const ENV = environment

export const DATABASE_URL = databaseUrl
export const AUTH_DATABASE_URL = 'mongodb://localhost:27017/rznu-lab1-users'

export const HOST = '127.0.0.1'
export const PORT = 3000
export const PROTOCOL = 'http'
