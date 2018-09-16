const graph = require('@microsoft/microsoft-graph-client')

class CalendarApiClient {
  constructor (options) {
    this.client = graph.Client.init({
      authProvider: cb => cb(null, options.token.accessToken)
    })
  }

  async getEvents (options) {
    return this.client
      .api(`/me/calendarView?startDateTime=${options.start.toISOString()}&endDateTime=${options.end.toISOString()}`)
      .top(options.maxEvents)
      .select('subject,start,end')
      .orderby('start/dateTime DESC')
      .get()
  }
}

module.exports = CalendarApiClient
