import plantStore from '../store/PlantStore'

/**
 * Resets and reload list of plants
 */
function loadPlants(current_growth_stage = '', facility_strain_id = '') {
  plantStore.isLoading = true
  let apiUrl = '/api/v1/plants/all'

  if (current_growth_stage.length > 0) {
    apiUrl = apiUrl + '/' + current_growth_stage
  }

  if (facility_strain_id.length > 0) {
    apiUrl = apiUrl + '?facility_strain_id=' + facility_strain_id
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

function searchPlants(current_growth_stage = '', facility_strain_id = '', search = '') {
  let apiUrl = '/api/v1/plants/search'

  if (current_growth_stage.length > 0) {
    apiUrl = apiUrl + '/' + current_growth_stage

    if (facility_strain_id.length > 0) {
      console.log('... has facility_strain_id')
      apiUrl = apiUrl + '/' + facility_strain_id

      if (search.length > 0) {
        apiUrl = apiUrl + '/' + search
      }
    }
  }

  console.log(apiUrl)

  return fetch(apiUrl, {
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
}

export { loadPlants, searchPlants }
