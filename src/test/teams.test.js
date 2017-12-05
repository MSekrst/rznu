import chai from 'chai'
import chaiHttp from 'chai-http'

import server from '../server'
import { getDbConnection } from '../database'

const should = chai.should()
chai.use(chaiHttp)

const teamExample = {
  name: 'Rijeka Devils',
  city: 'Rijeka'
}

const playerExample = {
  name: 'Ivan Horvat',
  number: 9
}

let insertedId = null

describe('Teams', () => {
  before(done => {
    setTimeout(() => {
      const db = getDbConnection()

      db.dropCollection('teams', () => {
        db.collection('teams').insert(teamExample, (err, data) => {
          insertedId = data.insertedIds[0]

          done()
        })
      })
    }, 500)
  })

  it('should GET array of teams', done => {
    chai
      .request(server)
      .get('/api/teams')
      .auth('user', 'pass')
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(200)
        res.body.should.be.a('array')

        done()
      })
  })

  it('should create a new team', done => {
    chai
      .request(server)
      .put('/api/teams')
      .auth('user', 'pass')
      .send(teamExample)
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.should.have.property('id')

        done()
      })
  })

  it('should modify existing team', done => {
    chai
      .request(server)
      .put(`/api/teams/${insertedId}`)
      .auth('user', 'pass')
      .send({ city: 'Ogulin' })
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(204)

        done()
      })
  })

  it('should delete existing team', done => {
    chai
      .request(server)
      .delete(`/api/teams/${insertedId}`)
      .auth('user', 'pass')
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(204)

        done()
      })
  })

  it('should return players in team', done => {
    chai
      .request(server)
      .get(`/api/teams/${insertedId}/players`)
      .auth('user', 'pass')
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(200)
        res.body.should.be.a('array')

        done()
      })
  })

  it('should modify existing team', done => {
    chai
      .request(server)
      .post(`/api/teams/${insertedId}/players`)
      .auth('user', 'pass')
      .send(playerExample)
      .end((err, res) => {
        chai.assert(err === null)
        res.should.have.status(201)

        done()
      })
  })
})
