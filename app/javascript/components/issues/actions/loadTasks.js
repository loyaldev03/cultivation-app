import { httpGetOptions } from '../../utils/FetchHelper'

const loadTasks = (batchId, facilityId = '') => {
  let url = `/api/v1/batches/${batchId}/tasks`
  if (facilityId.length > 0) {
    url = url + `?facility_id=${facilityId}`
  }

  return fetch(url, httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(({ status, data }) => {
      if (status >= 400 && !data && !data.data) {
        return []
      } else {
        const options = data.data.map(x => {
          let label = x.attributes.name
          if (x.indent > 0) {
            label = x.attributes.wbs + '. '
          }

          return ({
            label,
            value: x.attributes.id,
            ...x.attributes
          })
        })
        return options
      }
    })
}

export default loadTasks
