const db = require('../lib/db')
var express = require('express')
var router = express.Router()

router.get('/', async function (req, res, next) {
  let parms = { title: 'Home', active: { home: true } }

  const id = req.user
  const authToken = db.getToken(id)

  parms.user = id
  parms.debug = `User: ${id}\nAuth Token: ${JSON.stringify(authToken)}`

  res.render('index', parms)
})

module.exports = router
