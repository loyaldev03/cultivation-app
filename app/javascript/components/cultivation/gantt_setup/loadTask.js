import TaskStore from './TaskStore'
import { formatDate2, httpGetOptions, addDayToDate } from '../../utils'

class LoadTask {
  formatData = tasks => {
    tasks.map(task => {
      if (task.attributes.start_date)
        task.attributes.start_date = new Date(task.attributes.start_date)
      if (task.attributes.end_date)
        task.attributes.end_date = addDayToDate(task.attributes.end_date, 1)
      return task
    })
    return tasks
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
