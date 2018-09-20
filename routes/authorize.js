var express = require('express')
var router = express.Router()
var authHelper = require('../lib/auth')
const db = require('../lib/db')

router.get('/', async function (req, res, next) {
  const code = req.query.code
  if (code) {
    try {
      const { authToken, idToken } = await authHelper.getTokenFromCode(code)

      res.cookie('srt_id_token', idToken, { maxAge: 7200000, httpOnly: true })
      db.setToken(authToken.user.name, authToken)
    } catch (error) {
      res.render('error', { title: 'Error', message: 'Error exchanging code for token', error: error })
    }

    res.redirect('/')
  } else {
    res.render('error', { title: 'Error', message: 'Authorization error', error: { status: 'Missing code parameter' } })
  }
})

router.get('/signout', function (req, res, next) {
  res.clearCookie('srt_id_token', { maxAge: 7200000, httpOnly: true })
  res.redirect('/')
})

module.exports = router
