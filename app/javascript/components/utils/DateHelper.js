import { parse, format, addMonths } from 'date-fns'

// Build Month Options starting from Start Date until +duration month
export const monthsOptions = (startDate = new Date(), duration = 12) => {
  const options = []
  for (let i = 0; i < duration; i++) {
    const dt = addMonths(startDate, i)
    options.push({
      value: format(dt, 'MM-YYYY', { awareOfUnicodeTokens: true }),
      label: format(dt, 'MMM YYYY', { awareOfUnicodeTokens: true })
    })
  }
  return options
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

export const formatDate = date => {
  return format(date, 'MMM dd, YYYY', { awareOfUnicodeTokens: true })
}
