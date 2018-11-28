import { httpGetOptions } from '../../../utils'

const getHarvestBatch = (id, includeFields='') => {
  let apiUrl = '/api/v1/plants/harvests/' + id

  if (includeFields.length > 0) {
    apiUrl += '?include=' + includeFields
  }

  return fetch(apiUrl, httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
}

export default getHarvestBatch
