import issueStore from '../store/IssueStore'
import { httpGetOptions } from '../../utils/FetchHelper'

const loadBatchIssues = batchId => {
  return fetch(`/api/v1/issues/by_batch/${batchId}`, httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      console.log(data)
      if (status == 200) {
        issueStore.load(data.data)
      }
    })
}

export default loadBatchIssues
