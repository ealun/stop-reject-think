var express = require('express')
var router = express.Router()
var authHelper = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const db = require('../lib/db')

router.get('/', async function (req, res, next) {
  const code = req.query.code
  if (code) {
    let accessToken

    try {
      accessToken = await authHelper.getTokenFromCode(code)
      authHelper.saveValuesToCookie(accessToken, res)

      const user = jwt.decode(accessToken.token.id_token)
      db.setToken(user.name, accessToken)
    } catch (error) {
      res.render('error', { title: 'Error', message: 'Error exchanging code for token', error: error })
    }

    // Redirect to home
    res.redirect('/')
  } else {
    // Otherwise complain
    res.render('error', { title: 'Error', message: 'Authorization error', error: { status: 'Missing code parameter' } })
  }
})

/* GET /authorize/signout */
router.get('/signout', function (req, res, next) {
  authHelper.clearCookies(res)

  // Redirect to home
  res.redirect('/')
})

module.exports = router
