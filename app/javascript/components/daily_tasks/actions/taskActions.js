import DailyTasksStore from '../store/DailyTasksStore'
import { httpOptions } from '../../utils/FetchHelper'

export const toggleTask = dailyTask => {
  switch (dailyTask.attributes.status) {
  case 'started':
    stopTask(dailyTask)
    break
  case 'stuck':
  case 'stopped':
  case 'done':
  default:
    startTask(dailyTask)
  }
}

const updateTaskInStore = data => {
  const batchWithTask = DailyTasksStore.dailyTasksByBatch.find(
    batch => batch.tasks.find(
      task => (task.attributes.task.id == data.attributes.task.id)
    )
  )
  const dailyTask = batchWithTask.tasks.find(
    task => (task.attributes.task.id == data.attributes.task.id)
  )
  dailyTask.attributes = data.attributes
}

export const startTask = dailyTask => {
  const apiUrl = `/api/v1/daily_tasks/${dailyTask.attributes.task.id}/start_task`
  const payload = { date: DailyTasksStore.date }

  fetch(apiUrl, httpOptions('PUT', payload))
    .then(response => {
      return response.json().then(data => {
        return {
          status: response.status,
          data: data.data
        }
      })
    })
    .then(({ status, data }) => updateTaskInStore(data))
}

export const stopTask = dailyTask => {
  const apiUrl = `/api/v1/daily_tasks/${dailyTask.attributes.task.id}/stop_task`

  fetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ date: DailyTasksStore.date }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json().then(data => {
        return {
          status: response.status,
          data: data.data
        }
      })
    })
    .then(({ data }) => updateTaskInStore(data))
}

export const addNotes = (dailyTask, notes) => {
  const apiUrl = `/api/v1/daily_tasks/${dailyTask.attributes.task.id}/add_notes`

  fetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ date: DailyTasksStore.date, notes: notes }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json().then(data => {
        return {
          status: response.status,
          data: data.data
        }
      })
    })
    .then(({ data }) => updateTaskInStore(data))
}

export const updateMaterialsUsed = (dailyTask, materials) => {
  const apiUrl = `/api/v1/daily_tasks/${dailyTask.attributes.task.id}/update_materials_used`

  const request = fetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ date: DailyTasksStore.date, materials: materials }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  request.then(response => {
    return response.json().then(data => {
      return {
        status: response.status,
        data: data.data
      }
    })
  })
  request.then(({ data }) => updateTaskInStore(data))

  return request
}