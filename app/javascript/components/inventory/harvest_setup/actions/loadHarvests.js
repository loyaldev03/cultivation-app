import batchStore from '../store/HarvestBatchStore'
import { httpGetOptions } from '../../../utils'

const loadHarvests = () => {
  console.log('loadHarvests')

  batchStore.isLoading = true
  return fetch('/api/v1/plants/harvests', httpGetOptions)
    .then(response => {
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
      batchStore.load(data.data)
      batchStore.isLoading = false
      return result
    })
}

export default loadHarvests