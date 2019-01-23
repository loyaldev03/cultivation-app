import currentIssueStore from '../store/CurrentIssueStore'
import { httpPostOptions } from '../../utils'

const addComment = payload => {
  // console.log('current issue addComment')

  return fetch(
    `/api/v1/issues/${payload.issueId}/add_comment`,
    httpPostOptions(payload)
  )
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      if (status === 200) {
        currentIssueStore.addComment(data.data.attributes)
      }
      return result
    })
}

export default addComment
