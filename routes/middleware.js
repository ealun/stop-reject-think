function authenticate (authenticator) {
  return async function (req, res, next) {
    const rawIdToken = req.cookies.srt_id_token
    if (!rawIdToken) {
      return res.redirect(302, '/login')
    }
    try {
      const idToken = await authenticator.verify(rawIdToken)
      req.user = idToken.name
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  authenticate
}
