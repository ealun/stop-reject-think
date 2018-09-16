const graph = require('@microsoft/microsoft-graph-client')

const db = require('./db')
const { blockOverscheduledDays } = require('./blocker')
const CalendarApiClient = require('./calendar')

const maxEvents = 100
const maxMeetingHours = 4
const pollingMsecs = 10 * 1000

function worker () {
  const authTokens = db.getTokens()
  console.log(`Polling: ${Object.keys(authTokens)}`)

  Object.keys(authTokens).forEach(async id => {
    const token = await db.refreshToken(authTokens[id])
    const client = new CalendarApiClient({ token })
    // Set start of the calendar view to today at midnight
    const start = new Date(new Date().setHours(0, 0, 0))
    // Set end of the calendar view to 7 days from start
    const end = new Date(new Date(start).setDate(start.getDate() + 7))

    try {
      // Get all events for the coming week
      const result = await client.getEvents({ start, end, maxEvents })
      const blockedDays = blockOverscheduledDays(result, maxMeetingHours)
      console.log(blockedDays)
    } catch (err) {
      console.log(err)
    }
  })
  reschedule()
}

function reschedule () {
  setTimeout(worker, pollingMsecs)
}

function start () {
  worker()
}

module.exports = {
  start
}
