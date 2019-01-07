import { httpGetOptions } from '../../utils/FetchHelper'

const loadTasks = batchId => {
  return fetch(` /api/v1/batches/${batchId}/tasks`, httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(({ status, data }) => {
      console.log(data)
      if (status >= 400) {
        return []
      } else {
        const options = data.data.map(x => ({
          value: x.attributes.id,
          label: `${x.attributes.wbs}.  ${x.attributes.name}`,
          ...x.attributes
        }))
        return options
      }
    })
}

export default loadTasks
