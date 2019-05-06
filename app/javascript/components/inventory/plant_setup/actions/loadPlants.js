import plantStore from '../store/PlantStore'
import isEmpty from 'lodash.isempty'
import { httpGetOptions } from '../../../utils'

/**
 * Resets and reload list of plants
 */
export default function loadPlants(
  current_growth_stage = '',
  facility_strain_id = '',
  facility_id = '',
  excludes = [],
) {
  plantStore.isLoading = true
  let apiUrl = '/api/v1/plants/all'

  if (current_growth_stage.length > 0) {
    apiUrl = apiUrl + '/' + current_growth_stage
  }

  if (facility_strain_id.length > 0) {
    apiUrl = apiUrl + '?facility_strain_id=' + facility_strain_id
  }

  if (facility_id && facility_id.length > 0) {
    apiUrl = apiUrl + '?facility_id=' + facility_id
  }

  if (!isEmpty(excludes)) {
    apiUrl = apiUrl + `&excludes[]=${excludes}`
  }

  fetch(apiUrl, httpGetOptions)
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
