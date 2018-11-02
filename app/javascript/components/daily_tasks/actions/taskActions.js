import DailyTasksStore from '../store/DailyTasksStore'
import { httpOptions, toastHttpError } from '../../utils/FetchHelper'

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
  const batchWithTask = DailyTasksStore.dailyTasksByBatch.find(batch =>
    batch.tasks.find(task => task.attributes.task.id == data.attributes.task.id)
  )
  const dailyTask = batchWithTask.tasks.find(
    task => task.attributes.task.id == data.attributes.task.id
  )
  dailyTask.attributes = data.attributes
}

export const startTask = dailyTask => {
  const apiUrl = `/api/v1/daily_tasks/${
    dailyTask.attributes.task.id
  }/start_task`
  const payload = { date: DailyTasksStore.date }

  return toastHttpError(
    fetch(apiUrl, httpOptions('PUT', payload))
      .then(response => {
        return response.json().then(data => {
          return {
            status: response.status,
            data: data.data
          }
        })
      })
      .then(({ data }) => updateTaskInStore(data))
  )
}

export const stopTask = dailyTask => {
  const apiUrl = `/api/v1/daily_tasks/${dailyTask.attributes.task.id}/stop_task`
  const payload = { date: DailyTasksStore.date }

  return toastHttpError(
    fetch(apiUrl, httpOptions('PUT', payload))
      .then(response => {
        return response.json().then(data => {
          return {
            status: response.status,
            data: data.data
          }
        })
      })
      .then(({ data }) => updateTaskInStore(data))
  )
}

export const addNotes = (dailyTask, notes) => {
  const apiUrl = `/api/v1/daily_tasks/${dailyTask.attributes.task.id}/add_notes`
  const payload = { date: DailyTasksStore.date, notes: notes }

  return toastHttpError(
    fetch(apiUrl, httpOptions('PUT', payload))
      .then(response => {
        return response.json().then(data => {
          return {
            status: response.status,
            data: data.data
          }
        })
      })
      .then(({ data }) => updateTaskInStore(data))
  )
}

export const updateMaterialsUsed = (dailyTask, materials) => {
  const apiUrl = `/api/v1/daily_tasks/${
    dailyTask.attributes.task.id
  }/update_materials_used`
  const payload = { date: DailyTasksStore.date, materials: materials }

  return toastHttpError(
    fetch(apiUrl, httpOptions('PUT', payload))
      .then(response => {
        return response.json().then(data => {
          return {
            status: response.status,
            data: data.data
          }
        })
      })
      .then(({ data }) => updateTaskInStore(data))
  )
}
