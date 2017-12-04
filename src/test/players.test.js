import chai from 'chai'
import chaiHttp from 'chai-http'

import server from '../server'
import { getDbConnection } from '../database'

const should = chai.should()
chai.use(chaiHttp)

const playerExample = {
  name: 'Ivan Horvat',
  number: 9
}

let insertedId = null

describe('Players', () => {
  before(done => {
    setTimeout(() => {
      const db = getDbConnection()

      db.dropCollection('players', () => {
        db.collection('players').insert(playerExample, (err, data) => {
          insertedId = data.insertedIds[0]

          done()
        })
      })
    }, 500)
  })

  it('should return 401 for unauthorized requests', done => {
    chai
      .request(server)
      .get('/api/players')
      .end((err, res) => {
        err.should.have.status(401)

        done()
      })
  })

  it('should GET array of players', done => {
    chai
      .request(server)
      .get('/api/players')
      .auth('user', 'pass')
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(200)
        res.body.should.be.a('array')

        done()
      })
  })

  it('should create a new player', done => {
    chai
      .request(server)
      .put('/api/players')
      .auth('user', 'pass')
      .send(playerExample)
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.should.have.property('id')

        done()
      })
  })

  it('should modify existing player', done => {
    chai
      .request(server)
      .put(`/api/players/${insertedId}`)
      .auth('user', 'pass')
      .send({ number: 13 })
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(204)

        done()
      })
  })

  it('should delete existing player', done => {
    chai
      .request(server)
      .delete(`/api/players/${insertedId}`)
      .auth('user', 'pass')
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(204)

        done()
      })
  })
})
