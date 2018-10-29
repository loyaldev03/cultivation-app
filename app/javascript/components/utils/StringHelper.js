export const isEmptyString = str =>
  str == null || (typeof str == 'string' && str.trim() == '')

export const safeDisplay = (str, fallback = '-') =>
  isEmptyString(str) ? fallback : str
