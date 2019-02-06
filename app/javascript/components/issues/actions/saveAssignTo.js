import { httpPostOptions } from '../../utils'
import getIssue from './getIssue'

const saveAssignTo = payload => {
  return fetch(`/api/v1/issues/${payload.id}/assign_to`, httpPostOptions(payload))
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
      getIssue(data.id)
    })
}

export default saveAssignTo
