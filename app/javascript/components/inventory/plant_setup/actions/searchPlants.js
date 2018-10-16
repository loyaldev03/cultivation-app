export default function searchPlants(
  current_growth_stage = '',
  facility_strain_id = '',
  search = ''
) {
  let apiUrl = '/api/v1/plants/search'

  if (current_growth_stage.length > 0) {
    apiUrl = apiUrl + '/' + current_growth_stage

    if (facility_strain_id.length > 0) {
      apiUrl = apiUrl + '/' + facility_strain_id

      if (search.length > 0) {
        apiUrl = apiUrl + '/' + search
      }
    }
  }

  return fetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json().then(data => {
      return {
        status: response.status,
        data: data.data
      }
    })
  })
}

