import TaskStore from './TaskStore'
import { formatDate2, httpGetOptions } from '../../utils'

class loadTask {
  formatData = tasks => {
    tasks.map(task => {
      if (task.attributes.start_date)
        task.attributes.start_date = new Date(task.attributes.start_date)
      if (task.attributes.end_date)
        task.attributes.end_date = new Date(task.attributes.end_date)
      return task
    })

    let new_task = tasks.map(task => {
      return {
        content: task.attributes.name,
        start: formatDate2(task.attributes.start_date),
        finish: formatDate2(task.attributes.end_date),
        indentation: this.get_indentation(task)
      }
    })

    return new_task
  }

  getEndDate = end_date => {
    return end_date.setDate(end_date.getDate() + 1)
  }

  get_indentation = task => {
    if (task.attributes.is_phase === true) {
      return 0
    }
    if (task.attributes.is_category === true) {
      return 1
    }
    if (
      task.attributes.is_category === false &&
      task.attributes.is_phase === false
    ) {
      return 2
    }
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
