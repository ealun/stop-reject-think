const graph = require('@microsoft/microsoft-graph-client')

const db = require('./db')

const pollingMsecs = 10 * 1000

function worker () {
  const authTokens = db.getTokens()
  console.log(`Polling: ${Object.keys(authTokens)}`)

  Object.keys(authTokens).forEach(async id => {
    const token = await db.refreshToken(authTokens[id])

    const client = graph.Client.init({
      authProvider: cb => cb(null, token.accessToken)
    })

    // Set start of the calendar view to today at midnight
    const start = new Date(new Date().setHours(0, 0, 0))
    // Set end of the calendar view to 7 days from start
    const end = new Date(new Date(start).setDate(start.getDate() + 7))

    try {
      // Get the first 10 events for the coming week
      const result = await client
        .api(`/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
        .top(10)
        .select('subject,start,end')
        .orderby('start/dateTime DESC')
        .get()

      console.log(result.value)
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
