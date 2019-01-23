export const isEmptyString = str =>
  str == null || (typeof str == 'string' && str.trim() == '')

export const safeDisplay = (str, fallback = '-') =>
  isEmptyString(str) ? fallback : str

const sanitizeText = text => (
  text ? text.replace(/_/g, ' ') : ''
)

const decimalFormatter = new Intl.NumberFormat('en', {
  minimumFractionDigits: 2
})

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export { decimalFormatter, moneyFormatter, sanitizeText }
