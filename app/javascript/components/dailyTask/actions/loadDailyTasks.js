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


const loadAllDailyTasks = () => {
  Promise.all([loadBatchTasksOnly(), loadOtherTasksOnly()]).then(result => {
    console.log(result)
    // Promise.all(result).then(x => { console.log(x)})
    // result[0].then(k => console.log(k))
  })
}

const loadBatchTasksOnly = () => {
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
      return batches
    })
}


const loadOtherTasksOnly = () => {
  
  return fetch('/api/v1/daily_tasks/other_tasks', httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(data => {
      console.log(data.data.batch)

      const batch = { id: 'others', ...data.data.batch }
      const tasks = data.data.tasks.map(x => ({
        id: x.id,
        ...x.attributes
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
