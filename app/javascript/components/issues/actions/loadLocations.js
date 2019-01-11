import { httpGetOptions } from '../../utils/FetchHelper'

const loadLocations = (batchId, taskId) => {
  if (!batchId || !taskId) {
    return Promise.resolve([])
  }

  return fetch(
    `/api/v1/batches/${batchId}/tasks/${taskId}/locations`,
    httpGetOptions
  ).then(response => response.json())
}

export default loadLocations
