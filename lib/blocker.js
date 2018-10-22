const moment = require('moment-timezone')

const sparse = require('./sparse')

class Blocker {
  constructor ({ client }) {
    this.client = client
  }

  static getOpenSlots (days, events) {
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

  /**
   * Create new events ("blocks") for all the available time between a
   * time/date range.
   *
   * @param {object} options - Options object.
   * @param {moment} options.start - Start of time range.
   * @param {moment} options.end - End of time range.
   * @param {object[]} options.events - Optional array of [start, end] time
   *   ranges representing scheduled events.
   */
  async block ({ start, end, events = null }) {
    if (!events) events = await this.client.getEvents({ start, end })
    const openSlots = Blocker.getOpenSlots([{ start, end }], events)
    openSlots.forEach(async openSlot => {
      const block = {
        start: openSlot.start,
        end: openSlot.end,
        subject: 'Blocked',
        body: {
          contentType: 'HTML',
          content: 'Blocked for mindfulness by stop-reject-think'
        }
      }
      await this.client.writeEvent(block)
    })
  }
}

module.exports = Blocker
