const { expect } = require('chai');
const calendarResponse = require('./mocks/calendar-response.json');
const { getMeetingsByDate } = require('../blocker');

describe('blocker', () => {
  describe('.getMeetingsByDate', () => {
    it('bins meetings by date', () => {
      const expected = {
        '2017-11-16': [{
          'start': '2017-11-16T08:00:00.0000000',
          'end': '2017-11-16T08:30:00.0000000'
        }],
        '2017-11-17': [{
          'start': '2017-11-17T10:00:00.0000000',
          'end': '2017-11-17T11:30:00.0000000'
        }],
      }
      expect(getMeetingsByDate(calendarResponse)).to.deep.equal(expected);
    });
  });
});
