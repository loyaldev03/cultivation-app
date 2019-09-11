import plantStore from '../store/PlantStore'
import isEmpty from 'lodash.isempty'
import { httpGetOptions } from '../../../utils'

/**
 * Resets and reload list of plants
 */
export default function loadDestroyedPlants(facility_id = '', excludes = []) {
  plantStore.isLoading = true
  let apiUrl = '/api/v1/plants/all_destroyed_plant'

  if (facility_id && facility_id.length > 0) {
    apiUrl = apiUrl + '?facility_id=' + facility_id
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
        console.log(
          'Something wrong when calling /api/v1/plants/all_destroyed_plants'
        )
      } else {
        plantStore.load(data)
        plantStore.isLoading = false
      }
    })
}
