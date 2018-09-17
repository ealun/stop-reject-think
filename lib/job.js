const db = require('./db')
const { getMeetingsByDate, getOverscheduledDays } = require('./blocker')
const CalendarApiClient = require('./calendar')

const defaultTimezone = 'Pacific Standard Time'
const maxEvents = 100
const maxMeetingHours = 4
const pollingMsecs = 10 * 1000
// const workStart = new Date(new Date().setHours(9, 0, 0))
// const workEnd = new Date(new Date().setHours(17, 0, 0))

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

    let result
    try {
      // Get all events for the coming week
      result = await client.getEvents({ start, end, maxEvents })
    } catch (err) {
      console.log(err)
      return
    }

    const meetingsByDate = getMeetingsByDate(result)
    const timeZone = result.value ? result.value[0].event.start.timeZone : defaultTimezone
    const overscheduledDays = getOverscheduledDays(meetingsByDate, maxMeetingHours)
    for (const day in overscheduledDays) {
      meetingsByDate[overscheduledDays[day]].reduce(async (last, next) => {
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
            await client.writeEvent(eventBody)
          } catch (err) {
            console.log(err)
          }
        }
        return next
      })
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
