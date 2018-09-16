/* eslint-env mocha */
const { expect } = require('chai')

const calendarResponse = require('./mocks/calendar-response.json')
const { getMeetingsByDate } = require('../lib/blocker')

describe('blocker', () => {
  describe('.getMeetingsByDate', () => {
    it('bins meetings by date', () => {
      const expected = {
        '2017-11-16': [{
          'startDate': new Date('2017-11-16T08:00:00.000'),
          'span': 0.5,
          'endDate': new Date('2017-11-16T08:30:00.000')
        }],
        '2017-11-17': [{
          'startDate': new Date('2017-11-17T10:00:00.000'),
          'span': 1.5,
          'endDate': new Date('2017-11-17T11:30:00.000')
        }]
      }
      expect(getMeetingsByDate(calendarResponse)).to.deep.equal(expected)
    })
  })
})
