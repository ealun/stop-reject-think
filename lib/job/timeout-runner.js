const { protect } = require('../protect')

const pollingMsecs = 10 * 1000

async function timeoutJob() {
  await protect()
  reschedule()
}

function reschedule () {
  setTimeout(timeoutJob, pollingMsecs)
}

function start () {
  return timeoutJob()
}

module.exports = {
  start
}
