import strainStore from '../store/StrainStore'

/**
 * Resets and reload list of plants
 */
export default function loadStrains(facility_id = null) {
  strainStore.isLoading = true
  let apiUrl = '/api/v1/strains'
  
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
        console.log('Something wrong when calling /api/v1/strains')
      } else {
        strainStore.load(data)
        strainStore.isLoading = false
      }
    })
}
