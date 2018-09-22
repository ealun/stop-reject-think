/* eslint-env mocha */
const { expect } = require('chai')

const { diff } = require('../lib/sparse')

describe('lib.sparse', () => {
  describe('difference', () => {
    it('handles no overlaps', () => {
      const a = [
        {
          start: 0,
          end: 2
        }
      ]
      const b = [
        {
          start: 2,
          end: 3
        }
      ]
      const c = diff(a, b)
      expect(c).to.deep.equal(a)
    })

    it('handles partial overlap with start', () => {
      const a = [
        {
          start: 1,
          end: 3
        }
      ]
      const b = [
        {
          start: 0,
          end: 2
        }
      ]
      const c = diff(a, b)
      expect(c).to.deep.equal([
        {
          start: 2,
          end: 3
        }
      ])
    })

    it('handles partial overlap with end', () => {
      const a = [
        {
          start: 0,
          end: 2
        }
      ]
      const b = [
        {
          start: 1,
          end: 5
        }
      ]
      const c = diff(a, b)
      expect(c).to.deep.equal([
        {
          start: 0,
          end: 1
        }
      ])
    })

    it('handles splitting', () => {
      const a = [
        {
          start: 0,
          end: 3
        }
      ]
      const b = [
        {
          start: 1,
          end: 2
        }
      ]
      const c = diff(a, b)
      expect(c).to.deep.equal([
        {
          start: 0,
          end: 1
        },
        {
          start: 2,
          end: 3
        }
      ])
    })
  })
})
