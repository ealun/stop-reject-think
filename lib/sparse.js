//
// Sparse bitset is an array of ranges: [ { start, end }, { start, end }, ... ]
//   * start and end are Numbers
//   * ranges can overlap
//   * no ordering
//
function diff (spans, events) {
  events.forEach((event, next) => {
    spans = spans.reduce((acc, span) => {
      if (event.end <= span.start ||
          event.start >= span.end) {
        // No overlap
        acc.push(span)
      } else if (event.start >= span.start &&
                 event.end <= span.end) {
        // event: |---|
        // span:  |----|
        // span0: |
        // span1:     ||
        const span0 = {
          start: span.start,
          end: event.start
        }
        const span1 = {
          start: event.end,
          end: span.end
        }

        if (span0.start < span0.end) acc.push(span0)
        if (span1.start < span1.end) acc.push(span1)
      } else if (event.start <= span.start) {
        // event: |---|
        // span:    |---|
        // span0:     |-|
        const span0 = {
          start: event.end,
          end: span.end
        }
        if (span0.start < span0.end) acc.push(span0)
      } else {
        // event:   |---|
        // span:  |---|
        // span0: |-|
        const span0 = {
          start: span.start,
          end: event.start
        }
        if (span0.start < span0.end) acc.push(span0)
      }
      return acc
    }, [])
  })
  return spans
}

module.exports = {
  diff
}
