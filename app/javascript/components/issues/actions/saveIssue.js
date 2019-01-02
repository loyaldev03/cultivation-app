import issueStore from '../store/IssueStore'
import { httpPostOptions } from '../../utils'

export const saveIssue = payload => {
  return fetch('/api/v1/issues', httpPostOptions(payload))
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
        issueStore.update(data.data)
      } else {
        issueStore.prepend(data.data)
      }

      return result
    })
}
