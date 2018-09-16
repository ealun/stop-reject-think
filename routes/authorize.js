var express = require('express')
var router = express.Router()
var authHelper = require('../helpers/auth')
const db = require('../lib/db')

router.get('/', async function (req, res, next) {
  const code = req.query.code
  if (code) {
    let authToken

    try {
      authToken = await authHelper.getTokenFromCode(code)
      authHelper.saveValuesToCookie(authToken, res)
      db.setToken(authToken.user.name, authToken)
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
