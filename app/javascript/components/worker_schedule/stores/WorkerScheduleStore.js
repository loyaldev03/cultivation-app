import { observable, action, computed } from 'mobx'
import { httpGetOptions, httpPostOptions } from '../../utils'
class WorkerScheduleStore {
  @observable isLoading = false
  @observable scheduleData = {}

  @action
  getTaskByDate = async date => {
    this.isLoading = true
    try {
      let url = `/api/v1/daily_tasks/tasks_by_date?date=${date}`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        console.log(response)
        return response
      }
    } catch (err) {
      console.error(err)
      return null
    } finally {
      this.isLoading = false
    }
  }
}
const workerScheduleStore = new WorkerScheduleStore()
export default workerScheduleStore
