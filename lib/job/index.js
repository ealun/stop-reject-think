const cronRunner = require('./cron-runner')
const timeoutRunner = require('./timeout-runner')

const runners = {
  timeout: timeoutRunner,
  cron: cronRunner
}
const runnerType = process.env.RUNNER || 'timeout'
if (!(runnerType in runners)) throw new RangeError(`Invalid RUNNER value: ${runnerType}`)

module.exports = runners[runnerType]
