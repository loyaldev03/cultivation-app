import issueStore from '../store/IssueStore'
import { httpPostOptions } from '../../utils'

const archiveIssue = payload => {
  return fetch('/api/v1/issues/archive', httpPostOptions(payload))
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

      if (payload.id) {
        // Remove archived item from the list
        issueStore.delete(data.data)
      }

      return result
    })
}

export default archiveIssue
