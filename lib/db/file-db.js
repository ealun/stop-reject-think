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

async function setToken (id, authToken) {
  const db = readDb()
  db.tokens[id] = authToken
  writeDb(db)
}

async function getTokens () {
  return readDb().tokens
}

async function getToken (id) {
  return getTokens()[id]
}

module.exports = {
  getToken,
  getTokens,
  setToken
}
