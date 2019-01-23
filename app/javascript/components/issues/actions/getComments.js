import { httpGetOptions } from '../../utils/FetchHelper'

const getComments = (issueId, fromCommentId = null) => {
  return fetch(`/api/v1/issues/${issueId}/comments`, httpGetOptions).then(
    response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    }
  ) // if completed, load into current issue store...
}

export default getComments
