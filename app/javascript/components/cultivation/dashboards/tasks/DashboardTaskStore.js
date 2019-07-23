import isEmpty from 'lodash.isempty'
import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions
} from '../../../utils'

function parseTask(taskAttributes) {
  return Object.assign(taskAttributes)
}

class TaskStore {
  @observable data_task_dashboard = []
  @observable task_dashboard_loaded = false

  @action
  async loadTasks_dashboard(facility_id) {
    this.isLoading = true
    this.task_dashboard_loaded = false
    const url = `/api/v1/dashboard_charts/tasks_dashboard?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_task_dashboard = response
        this.task_dashboard_loaded = true
      } else {
        this.data_task_dashboard = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
}

const taskStore = new TaskStore()

export default taskStore
