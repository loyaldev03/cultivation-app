import { httpGetOptions } from '../../utils/FetchHelper'

const getIssue = issueId => {
  return fetch(`/api/v1/issues/${issueId}`, httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
}

export default getIssue
