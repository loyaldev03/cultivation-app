import { format, addMonths } from 'date-fns'

// Build Month Options starting from Start Date until +duration month
export const monthsOptions = (startDate = new Date, duration = 12) => {
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
