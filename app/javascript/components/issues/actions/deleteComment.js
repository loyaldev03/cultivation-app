import currentIssueStore from '../store/CurrentIssueStore'
import { httpPostOptions } from '../../utils'

const deleteComment = (id, comment_id) => {
  return fetch(
    `/api/v1/issues/${id}/delete_comment`,
    httpPostOptions({ comment_id })
  )
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status } = result
      if (status === 200) {
        currentIssueStore.deleteComment(comment_id)
      }
      return result
    })
}

export default deleteComment
