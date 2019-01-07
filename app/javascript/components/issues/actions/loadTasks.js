import { httpGetOptions } from '../../utils/FetchHelper'
import taskStore from '../store/TaskStore'

const loadTasks = batchId => {
  return fetch(` /api/v1/batches/${batchId}/tasks`, httpGetOptions).then(
    response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    }
  ).then(({ status, data }) => {
    console.log(data)
    if (status >= 400) {
      taskStore.load([])
    }  
    else {
      const options = data.data.map(x => ({
        value: x.attributes.id,
        label: `${'. '.repeat(x.attributes.indent)} ${x.attributes.wbs}  ${
          x.attributes.name
        }`,
        ...x.attributes 
      }))
      
      taskStore.load(options)
    }
  })
}

export default loadTasks
