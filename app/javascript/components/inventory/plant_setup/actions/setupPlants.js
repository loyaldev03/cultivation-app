import plantStore from '../store/PlantStore'

export default function setupPlants(payload, growth_stage) {
  return fetch('/api/v1/plants/setup_plants?growth_stage=' + growth_stage, {
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
