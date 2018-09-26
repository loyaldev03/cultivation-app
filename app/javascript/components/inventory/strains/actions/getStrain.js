export default function getStrain(id) {
  return fetch('/api/v1/strains/' + id, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json().then(data => {
      // console.log(data)
      return {
        status: response.status,
        data: data.data
      }
    })
  })
}
