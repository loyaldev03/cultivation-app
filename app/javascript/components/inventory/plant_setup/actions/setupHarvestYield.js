import plantStore from '../store/PlantStore'

export default function setupHarvestYield(payload) {
  console.log('setupHarvestYield')
  console.log(payload)

  // return Promise.resolve({ data: [], status: 200 })
  return fetch('/api/v1/plant_setup/setup_harvest_yield', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {

      console.log(result)
      const { status, data } = result
      if (status == 200) {
        const savedPlants = JSON.parse(data.data).data
        plantStore.prepend(savedPlants)
      }

      return result
    })
}
