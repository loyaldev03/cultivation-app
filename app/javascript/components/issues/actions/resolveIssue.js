import issueStore from '../store/IssueStore'
import currentIssue from '../store/CurrentIssueStore'
import { httpPostOptions } from '../../utils'

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
      if (status !== 200) {
        return result
      }

      console.log(data)
      
      issueStore.update(data.data)
      currentIssue.setIssue(data.data)
      currentIssue.setComments(data.data.comments)
      return result
    })
}

export default resolveIssue
