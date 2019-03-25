import batchStore from '../store/HarvestBatchStore'
import { httpGetOptions } from '../../../utils'

const loadHarvests = facility_id => {
  batchStore.isLoading = true
  return fetch(
    `/api/v1/plants/harvests?facility_id=${facility_id}`,
    httpGetOptions
  )
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      if (status !== 200) {
        return result
      }
      batchStore.load(data.data)
      batchStore.isLoading = false
      return result
    })
}

export default loadHarvests
