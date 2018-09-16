const fs = require('fs')
const jwt = require('jsonwebtoken')

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

function setToken (id, accessToken) {
  const db = readDb()
  const user = jwt.decode(accessToken.token.id_token)

  db.tokens[id] = {
    graph_access_token: accessToken.token.access_token,
    graph_user_name: user,
    graph_refresh_token: accessToken.token.refresh_token,
    graph_token_expires: accessToken.token.expires_at.getTime()
  }

  writeDb(db)
}

module.exports = {
  setToken
}
