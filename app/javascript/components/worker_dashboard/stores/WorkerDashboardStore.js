import { observable, action, computed } from 'mobx'
import { httpGetOptions, httpPostOptions, toast } from '../../utils'

class WorkerDashboardStore {
  @observable taskData = []

  @action
  getTaskByDate = async date => {
    this.isLoading = true
    try {
      let url = `/api/v1/daily_tasks/tasks_by_date?date=${date}`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        return response
      }
    } catch (err) {
      console.error(err)
      return null
    } finally {
      this.isLoading = false
    }
  }
  @action
  getTask = async () => {
    this.isLoading = true
    try {
      let url = `api/v1/daily_tasks/tasks`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
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
const workerDashboardStore = new WorkerDashboardStore()
export default workerDashboardStore
