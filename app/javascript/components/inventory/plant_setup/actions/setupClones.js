import plantStore from '../store/PlantStore'

export default function setupClones(payload) {
  return fetch('/api/v1/plants/setup_clones', {
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
        // const savedPlants = JSON.parse(data.data).data
        plantStore.prepend(data.data)
      }

      return result
    })
}
