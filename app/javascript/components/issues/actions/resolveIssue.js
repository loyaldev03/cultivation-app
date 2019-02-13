import { httpPostOptions } from '../../utils'
import getIssue from './getIssue'
import issuesStore from '../store/IssueStore'

const resolveIssue = payload => {
  return fetch(`/api/v1/issues/${payload.id}/resolve`, httpPostOptions(payload))
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      if (status === 200) {
        getIssue(data.id).then(updatedIssue => {
          issuesStore.update(updatedIssue)
        })
      }
      return result
    })
}

export default resolveIssue
