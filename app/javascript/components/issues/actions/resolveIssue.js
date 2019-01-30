import { httpPostOptions } from '../../utils'
import getIssue from './getIssue'

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

      console.log(data.id)
      getIssue(data.id)
    })
}

export default resolveIssue
