import store from '../store/CultivationBatchStore'
import { httpPostOptions } from '../../../utils'

export default function saveCultivationBatch(payload) {
  return fetch('/api/v1/batches/setup_simple_batch', httpPostOptions(payload))
    .then(response => {
      return response.json().then(data => {
        return { status: response.status, data }
      })
    })
    .then(result => {
      const { status, data } = result
      if (status == 200) {
        const batch = data.data
        if (payload.id) {
          store.update(batch)
        } else {
          store.prepend(batch)
        }
      }
      return result
    })
}
