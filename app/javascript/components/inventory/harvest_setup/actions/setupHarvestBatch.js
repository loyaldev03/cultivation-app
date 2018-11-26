import batchStore from '../store/HarvestBatchStore'
import { httpPostOptions } from '../../../utils'

export const setupHarvestBatch = payload => {
  console.log('setupHarvestBatch')
  console.log(payload)

  return fetch('/api/v1/plants/setup_harvest_batch', httpPostOptions(payload))
    .then(response => {
      // console.log(response.status)
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      console.log(result)
      const { status, data } = result
      if (status !== 200) {
        return result
      }

      if (payload.id) {
        batchStore.update(data.data)
      } else {
        batchStore.prepend(data.data)
      }

      return result
    })
}
