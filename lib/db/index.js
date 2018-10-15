const auth = require('../auth')
const datastoreDb = require('./datastore-db')
const fileDb = require('./file-db')

const dbs = {
  file: fileDb,
  datastore: datastoreDb
}
const dbType = process.env.DB || 'file'
if (!(dbType in dbs)) throw new RangeError(`Invalid DB value: ${dbType}`)

const db = dbs[dbType]

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
  await db.setToken(authToken.user.name, authToken)

  return authToken
}

module.exports = { ...db, refreshToken }
