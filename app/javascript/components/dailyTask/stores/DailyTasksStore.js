import { observable, action, computed, toJS } from 'mobx'
import { httpPutOptions } from '../../utils'
class DailyTaskStore {
  batches = observable([])

  load(batches) {
    this.batches.replace(batches)
  }

  @computed
  get bindable() {
    return this.batches.slice()
  }

  @action
  async updateTimeLog(action, taskId) {
    this.isLoading = true
    const url = `/api/v1/daily_tasks/time_log`
    try {
      const payload = { actions: action, task_id: taskId }
      const response = await (await fetch(url, httpPutOptions(payload))).json()
      if (response.data) {
        // this.loadTasks(batchId)
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.error(error)
    } finally {
      // this.isLoading = false
    }
  }
}

const dailyTasksStore = new DailyTaskStore()
export default dailyTasksStore
