export const httpGetOptions = {
  method: 'GET',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

export const httpPostOptions = payload => ({
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify(payload),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
