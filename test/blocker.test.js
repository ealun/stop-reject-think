const { expect } = require('chai');
const calendarResponse = require('calendar-response.json');
const { getMeetingsByDate } = require('../blocker');

describe('blocker', () = {
    describe('.getMeetingsByDate', () => {
	it('bins meetings by date', () => {
	    expect(getMeetingsByDate(calendarResponse)).to.equal('foo');
	});
  });

});
