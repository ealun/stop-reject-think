/* eslint-env mocha */
const { expect } = require('chai')
const { authenticate } = require('../routes/middleware')

describe('routes.middleware', () => {
  describe('.authenticate', () => {
    it('handles authenticator error', done => {
      const authenticator = {
        verify: async () => { throw new Error('norf!') }
      }
      const ware = authenticate(authenticator)
      const req = {
        cookies: { srt_id_token: 'does not matter' }
      }
      const res = {}
      ware(req, res, err => {
        expect(err).to.be.an('Error')
        done()
      })
    })

    it('handles missing srt_id_token', done => {
      const authenticator = {}
      const ware = authenticate(authenticator)
      const req = {
        cookies: {}
      }
      const res = {
        redirect: (code, path) => {
          expect(code).to.equal(302)
          expect(path).to.equal('/login')
          done()
        }
      }
      const err = () => {}
      ware(req, res, err)
    })

    it('handles srt_id_token', done => {
      const authenticator = {
        verify: async () => ({ name: 'Heiny' })
      }
      const ware = authenticate(authenticator)
      const req = {
        cookies: { srt_id_token: 'does not matter' }
      }
      const res = {}
      ware(req, res, err => {
        expect(err).to.be.an('undefined')
        expect(req.user).to.equal('Heiny')
        done()
      })
    })
  })
})
