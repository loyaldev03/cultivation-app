import { parse, format, addMonths } from 'date-fns'
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

export const dateToMonthOption = dt => {
  return format(dt, 'MM-YYYY', { awareOfUnicodeTokens: true })
}

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
  return format(date, 'MMM dd, YYYY', { awareOfUnicodeTokens: true })
}

export const formatDate2 = date => {
  return format(date, 'M/d/YYYY', { awareOfUnicodeTokens: true })
}

export const formatUnicodeAware = (date, frmt, options = {}) =>
  format(date, frmt, Object.assign({}, { awareOfUnicodeTokens: true }, options))