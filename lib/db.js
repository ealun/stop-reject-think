const auth = require('../helpers/auth')
const fs = require('fs')

const dbPath = './db.json'

function readDb () {
  if (!fs.existsSync(dbPath)) {
    writeDb({
      tokens: {}
    })
  }
  return JSON.parse(fs.readFileSync(dbPath).toString())
}

function writeDb (data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function setToken (id, authToken) {
  const db = readDb()
  db.tokens[id] = authToken
  writeDb(db)
}

function getTokens () {
  return readDb().tokens
}

function getToken (id) {
  return getTokens()[id]
}

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
  setToken(authToken.user.name, authToken)

  return authToken
}

module.exports = {
  getToken,
  getTokens,
  refreshToken,
  setToken
}
