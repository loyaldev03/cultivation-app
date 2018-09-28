import plantStore from '../store/PlantStore'

/**
 * Resets and reload list of plants
 */
export default function loadPlants(current_growth_stage = '') {
  plantStore.isLoading = true
  let apiUrl = '/api/v1/plants/all'
  if (current_growth_stage.length > 0) {
    apiUrl = apiUrl + '/' + current_growth_stage
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
