import TaskStore from '../stores/TaskStore'
import { fadeToast, toast } from '../../../utils/toast'
import loadTasks from './loadTask'

class updateTask {
  updateTask(state) {
    let id = state.id
    let url = `/api/v1/batches/${state.batch_id}/tasks/${id}`

    let task = {
      assigned_employee: state.assigned_employee,
      batch_id: state.batch_id,
      days_from_start_date: state.days_from_start_date,
      depend_on: state.depend_on,
      duration: state.duration,
      end_date: state.end_date.toDateString(),
      estimated_hours: state.estimated_hours,
      id: state.id,
      is_category: state.is_category,
      is_phase: state.is_phase,
      name: state.name,
      parent_id: state.parent_id,
      phase: state.phase,
      position: state.position,
      start_date: state.start_date.toDateString(),
      task_category: state.task_category,
      time_taken: state.time_taken,
      task_type: state.task_type
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
          toast('Task Updated', 'success')
          loadTasks.loadbatch(state.batch_id)
          window.editorSidebar.close()
        } else {
          let keys = Object.keys(data.errors)
          console.log(data.errors[keys[0]])
          let error_container = document.getElementById('error-container')
          error_container.style.display = 'block'
          let error_message = document.getElementById('error-message')
          error_message.innerHTML = data.errors[keys[0]]
          toast(data.errors[keys[0]], 'error')
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
        if (data && data.data && data.data.id != null) {
          toast('Task Moved', 'success')

          loadTasks.loadbatch(batch_id)
        } else {
          toast('Something happen', 'error')
        }
      })
  }

  updateTaskResource(state) {
    let id = state.id
    let url = `/api/v1/batches/${state.batch_id}/tasks/${id}`

    let task = {
      batch_id: state.batch_id,
      user_ids: state.users.map(e => e.id),
      id: state.id
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
          let newTask = TaskStore.slice().find(e => e.id === state.id)
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
