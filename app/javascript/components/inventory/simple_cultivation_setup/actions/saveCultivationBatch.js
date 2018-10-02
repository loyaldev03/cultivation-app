import store from '../store/CultivationBatchStore'

export default function saveCultivationBatch(payload) {
  return fetch('/api/v1/batches/setup_simple_batch', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json().then(data => {
        console.log(data)
        return { status: response.status, data }
      })
    })
    .then(result => {
      const { status, data } = result
      if (status == 200) {
        const batch = data.data
        console.log('saved batch')
        console.log(batch)
        store.prepend(batch)
      }

      return result
    })
}
