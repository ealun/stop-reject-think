const moment = require('moment-timezone')

const db = require('./db')
const CalendarApiClient = require('./calendar')
const sparse = require('./sparse')

// const defaultTimezone = 'Pacific Standard Time'
const maxEvents = 100
// const maxMeetingHours = 4
const pollingMsecs = 10 * 1000
// const workStart = new Date(new Date().setHours(9, 0, 0))
// const workEnd = new Date(new Date().setHours(17, 0, 0))

function getOpenSlots (days, events) {
  days = days.map(day => ({
    start: day.start.valueOf(),
    end: day.end.valueOf()
  }))
  events = events.map(event => ({
    start: event.start.valueOf(),
    end: event.end.valueOf()
  }))
  return sparse.diff(days, events).map(slot => ({
    start: moment(slot.start),
    end: moment(slot.end)
  }))
}

function worker () {
  const authTokens = db.getTokens()
  console.log(`Polling: ${Object.keys(authTokens)}`)

  Object.keys(authTokens).forEach(async id => {
    const token = await db.refreshToken(authTokens[id])
    const client = new CalendarApiClient({ token })

    const start = moment().startOf('day')
    const end = moment().add(7, 'days').startOf('day')

    const events = await client.getEvents({ start, end, maxEvents })
    const openSlots = getOpenSlots([{ start, end }], events)
    console.log('open slots:\n', openSlots)

    /*
    for (const day in overscheduledDays) {
      meetings[overscheduledDays[day]].reduce(async (last, next) => {
        const openStart = last.endDate
        const openEnd = next.startDate

        if ((openEnd - openStart) > 0) {
          const eventBody = {
            start: {
              dateTime: openStart.toISOString(),
              timeZone
            },
            end: {
              dateTime: openEnd.toISOString(),
              timeZone
            },
            subject: 'Blocked',
            body: {
              contentType: 'HTML',
              content: 'Blocked for mindfulness by stop-reject-think'
            }
          }

          try {
            console.log(eventBody)
            // await client.writeEvent(eventBody)
          } catch (err) {
            console.log(err)
          }
        }
        return next
      })
    */
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
