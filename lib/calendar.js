const graph = require('@microsoft/microsoft-graph-client')
const moment = require('moment-timezone')

class CalendarApiClient {
  constructor (options) {
    this.client = graph.Client.init({
      authProvider: cb => cb(null, options.token.accessToken)
    })
    this.maxEvents = options.maxEvents || 100
  }

  /**
   * Fetch an array of events. All times are moments.
   * @param {Object} { start, end, maxEvents }
   * @returns {Object[]} Events
   */
  async getEvents (options) {
    const apiResults = await this.client
      .api(`/me/calendarView?startDateTime=${options.start.toISOString()}&endDateTime=${options.end.toISOString()}`)
      .top(options.maxEvents || this.maxEvents)
      .select('subject,start,end,isCancelled')
      .orderby('start/dateTime')
      .get()
    if (!apiResults.value) {
      throw Error('microsoft-graph-client response missing value')
    }
    //
    // Always return moment dates
    //
    return apiResults.value
      .filter(value => {
        return !value.isCancelled
      })
      .map(value => ({
        subject: value.subject,
        start: moment.tz(value.start.dateTime, value.start.timeZone),
        end: moment.tz(value.end.dateTime, value.end.timeZone)
      }))
  }

  writeEvent (event) {
    event = Object.assign({}, event)
    //
    // Convert moment dates to "microsoft dates".
    //
    event.start = {
      dateTime: event.start.toISOString(),
      timeZone: 'UTC'
    }
    event.end = {
      dateTime: event.end.toISOString(),
      timeZone: 'UTC'
    }
    return this.client
      .api('/me/calendar/events')
      .post(event)
  }
}

module.exports = CalendarApiClient
