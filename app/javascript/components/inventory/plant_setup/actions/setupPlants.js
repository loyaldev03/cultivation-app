import plantStore from '../store/PlantStore'

export default function setupPlants(payload) {
  return fetch('/api/v1/plants/setup_plants', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json().then(data => {
        console.log(data)
        return {
          status: response.status,
          data
        }
      })
    })
    .then(result => {
      const { status, data } = result
      if (status == 200) {
        console.log(data.data)

        if (payload.id.length > 0) {
          plantStore.update(data.data)
        } else {
          plantStore.prepend(data.data)
        }
      }

      return result
    })
}
