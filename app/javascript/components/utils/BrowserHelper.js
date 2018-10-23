export const getCookie = cookieName => {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cookieName + '=')
    if (cStart !== -1) {
      cStart = cStart + cookieName.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) {
        cEnd = document.cookie.length
      }
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}
