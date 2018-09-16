const credentials = {
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_PASSWORD
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
}
const oauth2 = require('simple-oauth2').create(credentials)
const jwt = require('jsonwebtoken')

/**
 * Return an "auth token", which is the data type we use for API tokens
 * outside this file. Auth tokens are JSON stringify-able.
 * @param {Object} accessToken - accessToken from simple-oauth2
 * @returns {Object} Auth token
 */
function makeAuthToken (accessToken) {
  const user = jwt.decode(accessToken.token.id_token)

  return {
    user,
    accessToken: accessToken.token.access_token,
    refreshToken: accessToken.token.refresh_token,
    expires: accessToken.token.expires_at.getTime()
  }
}

function getAuthUrl () {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  })
  console.log(`Generated auth url: ${returnVal}`)
  return returnVal
}

async function getTokenFromCode (authCode) {
  const result = await oauth2.authorizationCode.getToken({
    code: authCode,
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  })

  const accessToken = oauth2.accessToken.create(result)
  console.log('Token created: ', accessToken.token)
  return makeAuthToken(accessToken)
}

async function refreshToken (authToken) {
  const refreshToken = authToken.refreshToken
  const accessToken = await oauth2.accessToken.create({refresh_token: refreshToken}).refresh()
  return makeAuthToken(accessToken)
}

async function getAccessToken (cookies, res) {
  // Do we have an access token cached?
  let token = cookies.graph_access_token

  if (token) {
    // We have a token, but is it expired?
    // Expire 5 minutes early to account for clock differences
    const FIVE_MINUTES = 300000
    const expiration = new Date(parseFloat(cookies.graph_token_expires - FIVE_MINUTES))
    if (expiration > new Date()) {
      // Token is still good, just return it
      return token
    }
  }

  const refreshToken = cookies.graph_refresh_token
  if (refreshToken) {
    const newToken = await oauth2.accessToken.create({refresh_token: refreshToken}).refresh()
    saveValuesToCookie(makeAuthToken(newToken), res)
    return newToken.token.access_token
  }

  // Nothing in the cookies that helps, return empty
  return null
}

function saveValuesToCookie (authToken, res) {
  res.cookie('graph_access_token', authToken.accessToken, {maxAge: 3600000, httpOnly: true})
  res.cookie('graph_user_name', authToken.user.name, {maxAge: 3600000, httpOnly: true})
  res.cookie('graph_refresh_token', authToken.refreshToken, {maxAge: 7200000, httpOnly: true})
  res.cookie('graph_token_expires', authToken.expires, {maxAge: 3600000, httpOnly: true})
}

function clearCookies (res) {
  // Clear cookies
  res.clearCookie('graph_access_token', {maxAge: 3600000, httpOnly: true})
  res.clearCookie('graph_user_name', {maxAge: 3600000, httpOnly: true})
  res.clearCookie('graph_refresh_token', {maxAge: 7200000, httpOnly: true})
  res.clearCookie('graph_token_expires', {maxAge: 3600000, httpOnly: true})
}

exports.getAuthUrl = getAuthUrl
exports.getTokenFromCode = getTokenFromCode
exports.getAccessToken = getAccessToken
exports.clearCookies = clearCookies
exports.saveValuesToCookie = saveValuesToCookie
exports.refreshToken = refreshToken
