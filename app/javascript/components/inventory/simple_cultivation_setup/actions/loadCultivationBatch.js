import store from '../store/CultivationBatchStore'
import { httpGetOptions } from '../../../utils'

export default function loadCultivationBatches(facility_id) {
  store.isLoading = true
  let apiUrl = `/api/v1/batches?facility_id=${facility_id}`

  fetch(apiUrl, httpGetOptions)
    .then(response => {
      return response.json().then(data => {
        //console.log(data.data)
        return {
          status: response.status,
          data: data.data
        }
      })
    })
    .then(({ status, data }) => {
      if (status >= 400) {
        console.log('Something wrong when calling /api/v1/batches/all')
      } else {
        store.load(data)
        store.isLoading = false
      }
    })
}
