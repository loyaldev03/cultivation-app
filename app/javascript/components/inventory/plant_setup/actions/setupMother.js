import plantStore from '../store/PlantStore'

export default function setupMother(payload) {
  return fetch('/api/v1/plants/setup_mother', {
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
        return { status: response.status, data }
      })
    })
    .then(result => {
      const { status, data } = result
      if (status == 200) {
        const savedPlants = data.data
        console.log('savedPlants')
        console.log(savedPlants)
        plantStore.prepend(savedPlants)
      }

      return result
    })
}
