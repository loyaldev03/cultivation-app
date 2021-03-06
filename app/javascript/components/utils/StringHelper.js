export const isEmptyString = str =>
  str == null || (typeof str == 'string' && str.trim() == '')

export const safeDisplay = (str, fallback = '-') =>
  isEmptyString(str) ? fallback : str

const sanitizeText = text => (text ? text.replace(/_/g, ' ') : '')

const decimalFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0
})

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

const numberFormatter = new Intl.NumberFormat('en')

export { decimalFormatter, moneyFormatter, sanitizeText, numberFormatter }
