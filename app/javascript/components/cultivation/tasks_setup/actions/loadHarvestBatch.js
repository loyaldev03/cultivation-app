import { httpGetOptions } from '../../../utils/FetchHelper'

const loadHarvestBatch = batchId => {
  return fetch(`/api/v1/batches/${batchId}/harvest_batch`, httpGetOptions).then(
    response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    }
  )
}

export default loadHarvestBatch
