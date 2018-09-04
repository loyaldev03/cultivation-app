import plantStore from '../store/PlantStore'

export default function setupClones(payload) {
  return fetch('/api/v1/plant_setup/setup_clones', {
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
    }).then(result => {
      const { status, data } = result
      if (status == 200) {
        const savedPlants = JSON.parse(data.data).data
        plantStore.add(savedPlants)
      }

      return result
    })
}
