const simpleOauth2 = require('simple-oauth2')
const jwt = require('jsonwebtoken')
const jwksRsa = require('jwks-rsa')

const credentials = {
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_PASSWORD
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
}

const oauth2 = simpleOauth2.create(credentials)

const jwksClient = jwksRsa({
  cache: true,
  jwksUri: `${credentials.auth.tokenHost}/common/discovery/v2.0/keys`
})

function verifyIdToken (rawIdToken) {
  //
  // https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-id-and-access-tokens#validating-tokens
  //
  function getKey (header, cb) {
    jwksClient.getSigningKey(header.kid, function (err, key) {
      if (err) return cb(err)
      const signingKey = key.publicKey || key.rsaPublicKey
      cb(null, signingKey)
    })
  }

  return new Promise((resolve, reject) => {
    jwt.verify(rawIdToken, getKey, function (err, decoded) {
      if (err) return reject(err)
      resolve(decoded)
    })
  })
}

/**
 * Return an "auth token", which is the data type we use for API tokens
 * outside this file. Auth tokens are JSON stringify-able.
 * @param {Object} accessToken - accessToken from simple-oauth2
 * @returns {Object} Auth token
 */
function makeAuthToken (accessToken) {
  const user = jwt.decode(accessToken.token.id_token)

  return {
    user,
    accessToken: accessToken.token.access_token,
    refreshToken: accessToken.token.refresh_token,
    expires: accessToken.token.expires_at.getTime()
  }
}

function getAuthUrl () {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  })
  console.log(`Generated auth url: ${returnVal}`)
  return returnVal
}

async function getTokenFromCode (authCode) {
  const result = await oauth2.authorizationCode.getToken({
    code: authCode,
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  })

  const accessToken = oauth2.accessToken.create(result)
  console.log('Token created: ', accessToken.token)
  return {
    authToken: makeAuthToken(accessToken),
    idToken: accessToken.token.id_token
  }
}

async function refreshToken (authToken) {
  const refreshToken = authToken.refreshToken
  const accessToken = await oauth2.accessToken.create({refresh_token: refreshToken}).refresh()
  return makeAuthToken(accessToken)
}

module.exports = {
  getAuthUrl,
  getTokenFromCode,
  refreshToken,
  verifyIdToken
}
