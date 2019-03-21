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
          // console.group('materials_used')
          // console.log(data)
          // console.groupEnd()

          materialUsedStore.load(data)
        })
    }) // if completed, load into current issue store...
}

export default loadDailyTasks
