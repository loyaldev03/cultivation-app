export default function getPlant(id, includeFields = '') {
  let apiUrl = '/api/v1/plants/' + id
 

  if (includeFields.length > 0) {
    apiUrl += '?include=' + includeFields
  }

  return fetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json().then(data => {
      return {
        status: response.status,
        data: data.data,
        included: data.included || []
      }
    })
  })
}