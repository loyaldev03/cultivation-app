import currentIssueStore from '../store/CurrentIssueStore'
import { httpPostOptions } from '../../utils'

const updateComment = (id, payload) => {
  return fetch(`/api/v1/issues/${id}/update_comment`, httpPostOptions(payload))
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status } = result
      if (status === 200) {
        currentIssueStore.updateComment(id, payload)
      }
      return result
    })
}

export default updateComment
