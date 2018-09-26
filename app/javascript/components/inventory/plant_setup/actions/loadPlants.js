import plantStore from '../store/PlantStore'

/**
 * Resets and reload list of plants
 */
export default function loadPlants(plant_type = '', strain_id = '') {
  plantStore.isLoading = true
  let apiUrl = '/api/v1/plants/all'
  if (plant_type) {
    apiUrl = apiUrl + '?plant_status=' + plant_type
  }
  if (strain_id) {
    apiUrl = apiUrl + '?strain_id=' + strain_id
  }

  fetch(apiUrl, {
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
        plantStore.isLoading = false
      }
    })
}
