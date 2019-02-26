import {
  format,
  addMonths,
  startOfDay,
  addSeconds,
  addDays,
  differenceInHours,
  distanceInWordsToNow
} from 'date-fns'
import { getCookie } from './'

const USER_TIMEZONE = getCookie('timezone')

// Build Month Options starting from Start Date until +duration month
export const monthsOptions = (startDate = new Date(), duration = 12) => {
  const options = []
  for (let i = 0; i < duration; i++) {
    const dt = addMonths(startDate, i)
    options.push({
      value: dateToMonthOption(dt),
      label: format(dt, 'MMM YYYY', { awareOfUnicodeTokens: true })
    })
  }
  return options
}

export const dateToMonthOption = dt =>
  format(dt, 'MM-YYYY', { awareOfUnicodeTokens: true })

export const monthOptionToString = monthOptionStr => {
  if (monthOptionStr) {
    const datePart = monthOptionStr.split('-')
    const dt = new Date(datePart[1], datePart[0] - 1, 1)
    return format(dt, 'MMM YYYY', { awareOfUnicodeTokens: true })
  } else {
    return ''
  }
}

export const monthStartDate = monthOptionStr => {
  const datePart = monthOptionStr.split('-')
  return new Date(datePart[1], datePart[0] - 1, 1)
}

export const monthOptionAdd = (monthOptionStr, month) => {
  const dt = monthStartDate(monthOptionStr)
  const result = addMonths(dt, month)
  return dateToMonthOption(result)
}

export const formatDate = date => {
  return format(date, 'MMM DD, YYYY', { awareOfUnicodeTokens: true })
}

export const formatDate2 = date =>
  format(date, 'M/DD/YYYY', { awareOfUnicodeTokens: true })

export const formatDate3 = date =>
  format(date, 'ddd, D MMM YYYY', { awareOfUnicodeTokens: true })

export const formatAgo = date => {
  const now = new Date()
  const res = differenceInHours(now, date)
  if (res > 12) {
    return format(date, 'ddd, D MMM YYYY, h:mm:ss a', {
      awareOfUnicodeTokens: true
    })
  } else {
    return distanceInWordsToNow(date, { addSuffix: true })
  }
}

const durationToDate = seconds =>
  addSeconds(startOfDay(new Date()), parseInt(seconds))

export const formatDuration = seconds => {
  if (parseInt(seconds) < 3600) {
    return format(durationToDate(seconds), 'm [mn]')
  }
  return format(durationToDate(seconds), 'H [hr] m [mn]')
}

export const formatTime = time => format(time, 'hh:mm A')

export const addDayToDate = (date, days) => addDays(new Date(date), days)
