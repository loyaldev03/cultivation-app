import store from '../store/CultivationBatchStore'

export default function loadCultivationBatches() {
  store.isLoading = true
  let apiUrl = '/api/v1/batches'
  
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
        console.log('Something wrong when calling /api/v1/batches/all')
      } else {
        store.load(data)
        store.isLoading = false
      }
    })
}
