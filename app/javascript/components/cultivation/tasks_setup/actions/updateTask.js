import TaskStore from '../stores/NewTaskStore'
import ErrorStore from '../stores/ErrorStore'
import { fadeToast, toast } from '../../../utils/toast'
import { httpPutOptions } from '../../../utils'

class updateTask {
  /**
   * state = {
   *  id: '<Task ID>'
   *  name
   *  duration....
   * }
   */
  updateTask(state) {
    let id = state.id
    let url = `/api/v1/batches/${state.batch_id}/tasks/${id}`

    let task = {
      assigned_employee: state.assigned_employee,
      batch_id: state.batch_id,
      days_from_start_date: state.days_from_start_date,
      depend_on: state.depend_on,
      duration: state.duration,
      end_date: state.end_date,
      estimated_hours: state.estimated_hours,
      id: state.id,
      is_category: state.is_category,
      is_phase: state.is_phase,
      name: state.name,
      parent_id: state.parent_id,
      phase: state.phase,
      position: state.position,
      start_date: state.start_date,
      task_category: state.task_category,
      time_taken: state.time_taken,
      task_type: state.task_type
    }

    fetch(url, httpPutOptions({ task }))
      .then(response => response.json())
      .then(data => {
        let error_container = document.getElementById('error-container')
        if (data && data.data && data.data.id != null) {
          error_container.style.display = 'none'
          toast('Task Updated', 'success')
          TaskStore.loadTasks(state.batch_id)
        } else {
          let keys = Object.keys(data.errors)
          error_container.style.display = 'block'
          let error_message = document.getElementById('error-message')
          error_message.innerHTML = data.errors[keys[0]]
          // let array = []
          // array[0] = data.errors[keys[0]]
          // ErrorStore.replace(array)
          // console.log(JSON.stringify(ErrorStore))
          toast(data.errors[keys[0]], 'error')
        }
      })
  }

  updateTaskResource(state) {
    let id = state.id
    let url = `/api/v1/batches/${state.batch_id}/tasks/${id}`

    let task = {
      batch_id: state.batch_id,
      user_ids: state.users.map(e => e.id),
      id: state.id,
      type: 'resource'
    }

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
        if (data && data.data && data.data.id != null) {
          let newTask = TaskStore.getTaskById(state.id)
          newTask.attributes.user_ids = state.users.map(e => e.id) // data replaced but table data not reloaded
          loadTasks.loadbatch(state.batch_id) // reload the whole table
        } else {
          toast('Something happen', 'error')
        }
      })
  }
}

const task = new updateTask()
export default task
