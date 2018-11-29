import TaskStore from './TaskStore'
import { formatDate2, httpGetOptions } from '../../utils'

class loadTask {
  formatData = tasks => {
    tasks.map(task => {
      if (task.attributes.start_date)
        task.attributes.start_date = formatDate2(task.attributes.start_date)
      if (task.attributes.end_date)
        task.attributes.end_date = formatDate2(task.attributes.end_date)
      return task
    })
    return tasks
  }

  loadbatch = async batchId => {
    let id = batchId
    let url = `/api/v1/batches/${id}/tasks`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      const formated = this.formatData(response.data)
      TaskStore.replace(formated)
    } catch (error) {
      console.error(error)
    }
  }
}

const task = new loadTask()
export default task
