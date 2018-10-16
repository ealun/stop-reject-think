const express = require('express')
const router = express.Router()

const { protect } = require('../lib/protect')

router.get('/protect', async (req, res, next) => {
  await protect()
  res.send('ok')
})

module.exports = router
