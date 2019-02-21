import { httpGetOptions } from '../../utils/FetchHelper'
import dailyTasksStore from '../stores/DailyTasksStore'

// TODO: not complete yet
const loadDailyTasks = () => {
  return fetch('/api/v1/daily_tasks/tasks', httpGetOptions).then(
    response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    }
  ).then(data => {
    // console.log(data)
    const batches = data.data.map( x => {
      const batch = {
        ...x.batch.attributes,
        id: x.batch.id,
        rooms: x.batch.rooms,
        tasks: x.tasks.map( y => ({
          id: y.id,
          ...y.attributes
        }))
      }

      console.log(batch)
      return batch
    })
    dailyTasksStore.load(batches)
  }) // if completed, load into current issue store...
}

export default loadDailyTasks
