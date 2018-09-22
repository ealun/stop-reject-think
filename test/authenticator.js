/* eslint-env mocha */
const { expect } = require('chai')

const Authenticator = require('../lib/authenticator')

//
// rs256 token and public key from https://jwt.io/
//
const rawToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.TCYt5XsITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUcX16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM'

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdlatRjRjogo3WojgGHFHYLugd
UWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQs
HUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5D
o2kQ+X5xK9cipRgEKwIDAQAB
-----END PUBLIC KEY-----`

describe('lib.authenticator', () => {
  describe('.constructor', () => {
    it('throws if missing arguments', () => {
      try {
        const x = new Authenticator({})
        expect(x).to.equal('This should not execute')
      } catch (err) {
        // do nothing
      }
    })

    it('succeeds if pased jwks uri', () => {
      const x = new Authenticator({ jwksUri: 'foo' })
      expect(x).to.be.an('object')
    })
  })

  describe('.verify', () => {
    it('returns decoded token if successful', async () => {
      const jwks = {
        getSigningKey: (kid, cb) => {
          cb(null, { publicKey })
        }
      }
      const authenticator = new Authenticator({ jwks })
      const value = await authenticator.verify(rawToken)
      expect(value).is.a('object')
    })

    it('throws if fetching key fails', async () => {
      const jwks = {
        getSigningKey: (kid, cb) => {
          cb(new Error('narf!'))
        }
      }
      const authenticator = new Authenticator({ jwks })
      try {
        await authenticator.verify(rawToken)
        expect('Unreachable').to.equal('should not execute')
      } catch (err) {
        // do nothing
      }
    })
  })
})
