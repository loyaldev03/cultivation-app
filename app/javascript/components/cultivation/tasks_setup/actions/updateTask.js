import TaskStore from '../stores/TaskStore'
import { fadeToast, toast } from '../../../utils/toast'
import loadTasks from './loadTask'

class updateTask {
  updateTask(state) {
    let id = state.id
    let url = `/api/v1/batches/${state.batch_id}/tasks/${id}`
    let task = state
    task.start_date = state.start_date.toDateString()
    task.end_date = state.end_date.toDateString()

    fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ task: task }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.data)
        if (data.data.id != null) {
          toast('Task Updated', 'success')
          let task = TaskStore.find(e => e.id === data.data.id)
          console.log(data.data)
          console.log(JSON.stringify(task))
          console.log(JSON.stringify(task.attributes))

          TaskStore.forEach((element, index) => {
            if (element.id === data.data.id) {
              TaskStore[index] = data.data
            }
          })

          loadTasks.loadbatch(state.batch_id)
          window.editorSidebar.close()
        } else {
          toast('Something happen', 'error')
        }
      })
  }

  updatePosition(batch_id, a, b) {
    let id = TaskStore[a].attributes.id
    let url = `/api/v1/batches/${batch_id}/tasks/${id}`
    fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ task: { id: id, position: a, type: 'position' } }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.data.id != null) {
          toast('Task Moved', 'success')

          loadTasks.loadbatch(batch_id)
        } else {
          toast('Something happen', 'error')
        }
      })
  }
}

const task = new updateTask()
export default task
