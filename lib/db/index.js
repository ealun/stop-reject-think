const auth = require('../auth')
const fileDb = require('./file-db')

const db = fileDb

async function refreshToken (authToken) {
  // We have a token, but is it expired?
  // Expire 5 minutes early to account for clock differences
  const FIVE_MINUTES = 300000
  const expiration = new Date(parseFloat(authToken.expires - FIVE_MINUTES))
  if (expiration > new Date()) {
    // Token is still good, just return it
    return authToken
  }

  console.log('Refreshing token')
  authToken = await auth.refreshToken(authToken)
  db.setToken(authToken.user.name, authToken)

  return authToken
}

module.exports = { ...db, refreshToken }
