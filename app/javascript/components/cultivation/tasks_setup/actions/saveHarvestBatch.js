import { httpPostOptions } from '../../../utils/FetchHelper'

const saveHarvestBatch = (batchId, payload) => {
  return fetch(`/api/v1/batches/${batchId}/save_harvest_batch`, httpPostOptions(payload))
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      console.log(result)
      return result
    })
}

export default saveHarvestBatch
