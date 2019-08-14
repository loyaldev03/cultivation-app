import { httpGetOptions, httpPostOptions } from '../../utils/FetchHelper'
import dailyTasksStore from '../stores/DailyTasksStore'
import materialUsedStore from '../stores/MaterialUsedStore'

// TODO: not complete yet
const loadDailyTasks = () => {
  return fetch('/api/v1/daily_tasks/tasks', httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(data => {
      // console.log(data)
      const batches = data.data.map(x => {
        const batch = {
          ...x.batch.attributes,
          id: x.batch.id,
          rooms: x.batch.rooms,
          tasks: x.tasks.map(y => ({
            id: y.id,
            ...y.attributes
          }))
        }
        // console.log(batch)
        return batch
      })
      dailyTasksStore.load(batches)

      const task_ids = []
      batches.forEach(batch => {
        batch.tasks.forEach(task => task_ids.push(task.id))
      })

      // console.log(task_ids)
      const payload = {
        task_ids,
        date: new Date()
      }

      fetch('/api/v1/daily_tasks/materials_used', httpPostOptions(payload))
        .then(response => response.json())
        .then(data => {
          materialUsedStore.load(data)
        })
    }) // if completed, load into current issue store...
}

const loadAllDailyTasks = (isShowAllTasks = false) => {
  Promise.all([
    loadBatchTasksOnly(isShowAllTasks),
    loadOtherTasksOnly(isShowAllTasks)
  ]).then(result => {
    const batches = result[0]
    const otherTasks = result[1]

    const task_ids = []
    batches.forEach(batch => {
      batch.tasks.forEach(task => task_ids.push(task.id))
    })

    if (otherTasks) {
      otherTasks.tasks.forEach(task => task_ids.push(task.id))
    }

    const payload = {
      task_ids,
      date: new Date()
    }

    fetch('/api/v1/daily_tasks/materials_used', httpPostOptions(payload))
      .then(response => response.json())
      .then(data => {
        materialUsedStore.load(data)
      })
  })
}

const loadBatchTasksOnly = (isShowAllTasks = false) => {
  let url = '/api/v1/daily_tasks/tasks'
  if (isShowAllTasks) {
    url = url + '?showAllTasks=yes'
  }
  return fetch(url, httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(data => {
      // console.log(data)
      const batches = data.data.map(x => {
        const batch = {
          ...x.batch.attributes,
          id: x.batch.id,
          rooms: x.batch.rooms,
          tasks: x.tasks.map(y => ({
            id: y.id,
            ...y.attributes
          }))
        }
        // console.log(batch)
        return batch
      })
      dailyTasksStore.load(batches)
      return batches
    })
}

const loadOtherTasksOnly = (isShowAllTasks = false) => {
  let url = '/api/v1/daily_tasks/other_tasks'
  if (isShowAllTasks) {
    url = url + '?showAllTasks=yes'
  }
  return fetch(url, httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(data => {
      if (!data.data) {
        dailyTasksStore.loadOtherTasks({})
        return null
      }

      const batch = { id: 'others', ...data.data.batch }
      const tasks = data.data.tasks.map(x => ({
        id: x.id,
        ...x.attributes,
        batch_id: 'others'
      }))

      const result = { ...batch, tasks }
      dailyTasksStore.loadOtherTasks(result)
      return result
    })
}

// return fetch('/api/v1/daily_tasks/other_tasks', httpGetOptions)

// const p1 = fetch('/api/v1/daily_tasks/tasks', httpGetOptions)
// const p2 = fetch('/api/v1/daily_tasks/other_tasks', httpGetOptions)

// Promise.all(p1, p2).then((r1, r2) => {
//    - get task_ids
//    - assign materials used to the
// })

export default loadDailyTasks
export { loadAllDailyTasks }
