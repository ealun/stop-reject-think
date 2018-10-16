const Datastore = require('@google-cloud/datastore')

const datastore = Datastore()

function setToken (id, authToken) {
  var entity = {
    key: datastore.key(['Token', id]),
    excludeFromIndexes: [
      'authToken'
    ],
    data: {
      authToken: JSON.stringify(authToken)
    }
  }
  return datastore.save(entity)
}

async function getTokens () {
  const query = datastore.createQuery('Token')
  //
  // TOD(sbw): this return format is compatible with the original file-db
  // format. There's probably a way to do this that doesn't require
  // iterating over all the results, and maybe a way to avoid the JSON.parse.
  //
  return (await datastore.runQuery(query))[0]
    .reduce((acc, result) => {
      const key = result[datastore.KEY]
      acc[key.name] = JSON.parse(result.authToken)
      return acc
    }, {})
}

async function getToken (id) {
  const key = datastore.key(['Token', id])
  const results = await datastore.get(key)
  const entity = results[0]
  if (!entity) return entity
  return JSON.parse(entity.authToken)
}

module.exports = {
  getToken,
  getTokens,
  setToken
}
