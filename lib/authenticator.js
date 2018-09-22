const jwt = require('jsonwebtoken')
const jwksRsa = require('jwks-rsa')

class Authenticator {
  constructor ({ jwks = null, jwksUri = null }) {
    if (jwks) {
      this.jwks = jwks
    } else if (jwksUri) {
      this.jwks = jwksRsa({
        cache: true,
        jwksUri: jwksUri
      })
    } else {
      throw new RangeError('Specify jwks or jwksUri')
    }
  }

  verify (rawIdToken) {
    //
    // https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-id-and-access-tokens#validating-tokens
    //
    const getKey = (header, cb) => {
      this.jwks.getSigningKey(header.kid, (err, key) => {
        if (err) return cb(err)
        const signingKey = key.publicKey || key.rsaPublicKey
        cb(null, signingKey)
      })
    }

    return new Promise((resolve, reject) => {
      jwt.verify(rawIdToken, getKey, (err, decoded) => {
        if (err) return reject(err)
        resolve(decoded)
      })
    })
  }
}

module.exports = Authenticator
