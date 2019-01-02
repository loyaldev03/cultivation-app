import { httpGetOptions } from '../../utils/FetchHelper'

const loadTasks = batchId => {
  return fetch(` /api/v1/batches/${batchId}/tasks`, httpGetOptions).then(
    response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    }
  )
}

export default loadTasks
