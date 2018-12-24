import strainStore from '../store/StrainStore'

export default function saveStrain(payload) {
  return fetch('/api/v1/strains', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json().then(data => {
        return {
          status: response.status,
          data
        }
      })
    })
    .then(result => {
      const { status, data } = result
      if (status == 200) {
        if (payload.id) {
          strainStore.update(data.data)
        } else {
          strainStore.prepend(data.data)
        }
      }

      return result
    })
}
