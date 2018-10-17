const moment = require('moment-timezone')

const Blocker = require('./blocker')
const db = require('./db')
const CalendarApiClient = require('./calendar')

const daysToProtect = 7

// Max of 4 hours / day
const maxMsecsOfEventsPerDay = 4 * 60 * 60 * 1000

async function protect () {
  const authTokens = await db.getTokens()
  console.log(`Polling: ${Object.keys(authTokens)} (${process.env.READONLY ? 'read-only' : 'write'})`)

  await Promise.all(Object.keys(authTokens).map(async id => {
    const token = await db.refreshToken(authTokens[id])
    const client = new CalendarApiClient({ token })
    const blocker = new Blocker({ client })

    const now = moment()
    for (let index = 0; index < daysToProtect; index++) {
      const start = moment(now).add(index, 'days').startOf('day')
      const end = moment(now).add(index + 1, 'days').startOf('day')
      const events = await client.getEvents({ start, end })

      const msecsOfEvents = events.reduce((acc, event) => acc + (event.end - event.start), 0)
      if (msecsOfEvents > maxMsecsOfEventsPerDay && !process.env.READONLY) {
        try {
          blocker.block({ start, end, events })
        } catch (err) {
          console.error(err)
        }
      }
    }
  }))
}

module.exports = {
  protect
}
