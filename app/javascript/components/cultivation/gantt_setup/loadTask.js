import TaskStore from './TaskStore'
import { formatDate2, httpGetOptions, addDayToDate } from '../../utils'

class LoadTask {
  formatData = tasks => {
    let new_tasks = tasks.map(task => {
      return {...task.attributes}
    })
    return new_tasks
  }

  loadbatch = async batchId => {
    let id = batchId
    let url = `/api/v1/batches/${id}/tasks`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      const formatted_data = this.formatData(response.data)
      return formatted_data || []
    } catch (error) {
      console.error(error)
    }
  }
}

const loadTask = new LoadTask()
export default loadTask
