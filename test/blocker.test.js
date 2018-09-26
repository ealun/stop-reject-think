/* eslint-env mocha */
const chai = require('chai')
chai.use(require('chai-moment'))
const expect = chai.expect

const moment = require('moment')
const sinon = require('sinon')

const Blocker = require('../lib/blocker')

describe('lib.blocker', () => {
  describe('.block', () => {
    it('blocks all open slots', async () => {
      const start = moment('2017-11-16T00:00:00.000')
      const end = moment('2017-11-17T00:00:00.000')
      const meetingEnd = moment(start).add('1', 'hour')
      const events = [
        {
          start: start,
          end: meetingEnd
        }
      ]

      const client = {
        writeEvent: sinon.spy(async event => {
          expect(event.start).to.be.sameMoment(meetingEnd)
        })
      }
      const blocker = new Blocker({ client })

      await blocker.block({ start, end, events })
      expect(client.writeEvent.called).to.equal(true)
    })
  })
})
