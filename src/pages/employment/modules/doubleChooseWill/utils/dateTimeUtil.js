export default {
  mergeSameDayDateTime (startDateTime, endDateTime) {
    const [startDate, startTime] = startDateTime.split(/\s/)
    const [endDate, endTime] = endDateTime.split(/\s/)
    if (startDate !== endDate) {
      return `${startDateTime} ~ ${endDateTime}`
    } else {
      return `${startDate} ${startTime}~${endTime}`
    }
  }
}
