import TaskStore from '../stores/TaskStore'

class loadTask {
  async loadbatch(batch_id) {
    let id = batch_id
    let url = `/api/v1/batches/${id}/tasks`
    await fetch(url)
      .then(resp => resp.json()) // Transform the data into json
      .then(function(data) {
        TaskStore.replace(data.data)
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}

const task = new loadTask()
export default task
