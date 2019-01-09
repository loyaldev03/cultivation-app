import { httpGetOptions } from '../../utils/FetchHelper'

const loadLocations = (facilityId, taskId) => {
  if (!facilityId) {
    return Promise.resolve([])
  }
  return fetch(
    `/api/v1/facilities/${facilityId}/search_locations`,
    httpGetOptions
  ).then(response => response.json())
}

export default loadLocations
