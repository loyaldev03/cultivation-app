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
      instruction: state.instruction,
      is_category: state.is_category,
      is_phase: state.is_phase,
      materials: state.materials,
      name: state.name,
      no_of_employees: state.no_of_employees,
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
        if (data.data.id != null) {
          toast('Task Updated', 'success')
          // let task = TaskStore.find(e => e.id === data.data.id)
          // console.log(data.data)
          // console.log(JSON.stringify(task))
          // console.log(JSON.stringify(task.attributes))

          // TaskStore.forEach((element, index) => {
          //   if (element.id === data.data.id) {
          //     TaskStore[index] = data.data
          //   }
          // })

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
        if (data.data.id != null) {
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
