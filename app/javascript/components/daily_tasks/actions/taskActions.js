import DailyTasksStore from '../store/DailyTasksStore'

export const toggleTask = (dailyTask) => {
  switch(dailyTask.attributes.status) {
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

export const startTask = (dailyTask) => {
  const apiUrl = `/api/v1/daily_tasks/${dailyTask.attributes.task.id}/start_task`

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
    .then(({ status, data }) => {
      const batchWithTask = DailyTasksStore.dailyTasksByBatch.find(
        function(batch) { return batch.tasks.find(
          function(task) { return task.attributes.task.id == data.attributes.task.id }
        )}
      )
      const dailyTask = batchWithTask.tasks.find(function(task) { return task.attributes.task.id == data.attributes.task.id })
      dailyTask.attributes = data.attributes

    })
}


export const stopTask = (dailyTask) => {
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
    .then(({ status, data }) => {
      const batchWithTask = DailyTasksStore.dailyTasksByBatch.find(
        function(batch) { return batch.tasks.find(
          function(task) { return task.attributes.task.id == data.attributes.task.id }
        )}
      )
      const dailyTask = batchWithTask.tasks.find(function(task) { return task.attributes.task.id == data.attributes.task.id })
      dailyTask.attributes = data.attributes
    })
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
    .then(({ status, data }) => {
      const batchWithTask = DailyTasksStore.dailyTasksByBatch.find(
        function(batch) { return batch.tasks.find(
          function(task) { return task.attributes.task.id == data.attributes.task.id }
        )}
      )
      const dailyTask = batchWithTask.tasks.find(function(task) { return task.attributes.task.id == data.attributes.task.id })
      dailyTask.attributes = data.attributes
    })
}