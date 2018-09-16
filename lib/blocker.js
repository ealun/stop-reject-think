const maxMeetingLength = 8
const millisecondsPerHour = 1000 * 3000

function blockOverscheduledDays (calendarResults, maxMeetingHours) {
  const meetings = getMeetingsByDate(calendarResults)
  // TODO: block off open spaces on overscheduled days.
  return getOverscheduledDays(meetings, maxMeetingHours)
}

function getMeetingsByDate (calendarResults) {
  const eventsByDate = {}
  calendarResults.value.forEach(event => {
    const startDate = new Date(event.start.dateTime)
    const endDate = new Date(event.end.dateTime)
    const date = event.start.dateTime.split('T')[0]
    const span = (endDate - startDate) / millisecondsPerHour
    if (span > maxMeetingLength) {
      return
    }
    const meetingBounds = {
      endDate,
      span,
      startDate
    }
    if (eventsByDate[date]) {
      eventsByDate[date].push(meetingBounds)
    } else {
      eventsByDate[date] = [meetingBounds]
    }
  })
  return eventsByDate
}

function getOverscheduledDays (meetingDays, maxMeetingHours) {
  const overscheduledDays = []
  for (let day in meetingDays) {
    if (getMeetingHours(meetingDays[day]) > maxMeetingHours) {
      overscheduledDays.push(day)
    }
  }
  return overscheduledDays
}

function getMeetingHours (day) {
  const meetingHours = day
    .map(event => { return event.span })
    .reduce((total, next) => { return total + next })
  return meetingHours
}

module.exports = {
  blockOverscheduledDays,
  getMeetingsByDate
}
