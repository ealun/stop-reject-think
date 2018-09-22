const express = require('express')
const router = express.Router()

const authHelper = require('../lib/auth')

router.get('/', async (req, res, next) => {
  const parms = {}
  parms.signInUrl = authHelper.getAuthUrl()
  parms.debug = parms.signInUrl

  res.render('login', parms)
})

module.exports = router
