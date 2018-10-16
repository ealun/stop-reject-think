require('dotenv').config()

var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const job = require('./lib/job')

var index = require('./routes/index')
var authorize = require('./routes/authorize')
const login = require('./routes/login')
const cron = require('./routes/cron')

const Authenticator = require('./lib/authenticator')
const { authenticate } = require('./routes/middleware')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/healthcheck', async (req, res, next) => {
  res.json({ status: 'ok' })
})

app.use('/cron', cron)

app.use('/login', login)
app.use('/authorize', authorize)

app.use(authenticate(new Authenticator({ jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys' })))

app.use('/', index)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

job.start()
