import { httpGetOptions } from '../../utils/FetchHelper'

// TODO: not complete yet
const getDailyTaskDetails = taskId => {
  return fetch(`/api/v1/issues/${taskId}/comments`, httpGetOptions).then(
    response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    }
  ) // if completed, load into current issue store...
}

export default getDailyTaskDetails
