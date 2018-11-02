import { toast } from '../utils/toast'

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

export const httpOptions = (method, payload) => ({
  method,
  credentials: 'include',
  body: JSON.stringify(payload),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export const toastHttpError = (fetch) => (
  fetch.catch(error => {
    toast('Error has occurred', 'error')
    console.error('Error:', error)
  })
)