import TaskStore from '../stores/TaskStore'
import { formatDate2 } from '../../../utils/DateHelper'
class loadTask {
  async loadbatch(batch_id) {
    let id = batch_id
    let url = `/api/v1/batches/${id}/tasks`
    let _this = this
    await fetch(url)
      .then(resp => resp.json()) // Transform the data into json
      .then(function(data) {
        let new_data = _this.formatData(data.data)
        TaskStore.replace(new_data)
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  formatData(tasks) {
    tasks.map(function(task) {
      task.attributes.start_date = formatDate2(task.attributes.start_date)
      task.attributes.end_date = formatDate2(task.attributes.end_date)
      return task
    })
    return tasks
  }
}

const task = new loadTask()
export default task
