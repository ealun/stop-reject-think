const db = require('../lib/db')
var express = require('express')
var router = express.Router()
var authHelper = require('../lib/auth')

router.get('/', async function (req, res, next) {
  let parms = { title: 'Home', active: { home: true } }

  const rawIdToken = req.cookies.srt_id_token

  try {
    const idToken = await authHelper.verifyIdToken(rawIdToken)
    const id = idToken.name
    const authToken = db.getToken(id)

    parms.user = id
    parms.debug = `User: ${id}\nAuth Token: ${JSON.stringify(authToken)}`
  } catch (err) {
    console.log(err)
    parms.signInUrl = authHelper.getAuthUrl()
    parms.debug = parms.signInUrl
  }

  res.render('index', parms)
})

module.exports = router
