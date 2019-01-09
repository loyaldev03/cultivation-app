import { httpGetOptions } from '../../utils/FetchHelper'

const loadUsers = facilityId => {
  if (!facilityId) {
    return Promise.resolve([])
  }
  
  return fetch(`/api/v1/users/by_facility/${facilityId}`, httpGetOptions)
    .then(response => response.json())
}

export default loadUsers
