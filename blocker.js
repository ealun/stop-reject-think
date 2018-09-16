function getMeetingsByDate (calendarResults) {
  const eventsByDate = {}
  calendarResults.value.forEach(event => {
    const startDate = event.start.dateTime
    const endDate = event.end.dateTime
    // Assume events don't span multiple days.
    const date = startDate.split('T')[0]
    const meetingBounds = {
      start: startDate,
      end: endDate
    }
    if (eventsByDate[date]) {
      eventsByDate[date].push(meetingBounds)
    } else {
      eventsByDate[date] = [meetingBounds]
    }
  })
  return eventsByDate
}

module.exports = {
  getMeetingsByDate
}
