import { httpPostOptions } from '../../utils'
import getIssue from './getIssue'

const saveFollowers = payload => {
  return fetch(
    `/api/v1/issues/${payload.id}/followers`,
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
      if (status !== 200) {
        return result
      }
      getIssue(data.id)
    })
}

export default saveFollowers
