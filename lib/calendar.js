const graph = require('@microsoft/microsoft-graph-client')
const moment = require('moment-timezone')

class CalendarApiClient {
  constructor (options) {
    this.client = graph.Client.init({
      authProvider: cb => cb(null, options.token.accessToken)
    })
  }

  /**
   * Fetch an array of events. All times are moments.
   * @param {Object} { start, end, maxEvents }
   * @returns {Object[]} Events
   */
  async getEvents (options) {
    const apiResults = await this.client
      .api(`/me/calendarView?startDateTime=${options.start.toISOString()}&endDateTime=${options.end.toISOString()}`)
      .top(options.maxEvents)
      .select('subject,start,end')
      .orderby('start/dateTime')
      .get()
    if (!apiResults.value) {
      throw Error('microsoft-graph-client response missing value')
    }
    return apiResults.value.map(value => ({
      subject: value.subject,
      start: moment.tz(value.start.dateTime, value.start.timeZone),
      end: moment.tz(value.end.dateTime, value.end.timeZone)
    }))
  }

  async writeEvent (options) {
    return this.client
      .api('/me/calendar/events')
      .post(options)
  }
}

module.exports = CalendarApiClient
