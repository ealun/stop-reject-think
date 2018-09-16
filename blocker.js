function getMeetingsByDate(calendarResults) {
  const eventsByDate = {};
  for (event in calendarResults) {
    const startDate = event.start.dateTime;
    const endDate = event.end.dateTime;
    // Assume events don't span multiple days.
    const date = startDate.split('T')[0];
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    if (eventsByDate.date) {
      eventsByDate.date.push(endTime - startTime);
    } else {
      eventsByDate.date = [endTime - startTime];
    }
  });
}

module.exports = {
  getMeetingsByDate
};
