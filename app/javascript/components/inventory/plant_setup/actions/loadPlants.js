import plantStore from '../store/PlantStore'

/** 
 * Resets and reload list of plants 
 */
export default function loadPlants(plant_type = 'mother') {
  fetch('/api/v1/plants/plants?plant_status=' + plant_type, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json().then(data => {
        return {
          status: response.status,
          data: data.data
        }
      })
    })
    .then(({ status, data }) => {
      if (status >= 400) {
        console.log('Something wrong when calling /api/v1/plants/plants')
      } else {
        plantStore.load(data)
      }
    })
}