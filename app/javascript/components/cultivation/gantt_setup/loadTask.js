import TaskStore from './TaskStore'
import { formatDate2, httpGetOptions, addDayToDate } from '../../utils'

class LoadTask {
  formatData = tasks => {
    tasks.map(task => {
      if (task.attributes.start_date)
        task.attributes.start_date = new Date(task.attributes.start_date)
      if (task.attributes.end_date)
        task.attributes.end_date = addDayToDate(task.attributes.end_date, 2)
      return task
    })

    let new_task = tasks.map(task => {
      const { id, name, start_date, end_date } = task.attributes
      return {
        id,
        content: name,
        start: start_date,
        finish: end_date,
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
      const formatted_data = this.formatData(response.data)
      // console.log(formatted_data)
      // TaskStore.replace(formatted_data)
      return formatted_data || []
    } catch (error) {
      console.error(error)
    }
  }
}

const loadTask = new LoadTask()
export default loadTask
