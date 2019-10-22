import { observable, action, computed, ObservableSet } from 'mobx'
import { httpGetOptions, httpPostOptions, toast } from '../../utils'
//arr_months={this.state.arr_batch_months}
// let arr_ranges = [
// { date: 'daily', label: 'Daily' },
// { date: 'weekly', label: 'Weekly' },
// { date: 'monthly', label: 'Monthly' }
// ]
class WorkerDashboardStore {
  @observable taskData = []
  @observable data_working_hour = []
  @observable working_hour_loaded = false
  @observable data_overall_info = []
  @observable worker_info_loaded = false

  @action
  async loadworkerWorkingHours(range) {
    this.isLoading = true
    this.working_hour_loaded = false
    const url = `/api/v1/worker_dashboard/working_hours_chart?range=${range}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_working_hour = response
        this.working_hour_loaded = true
      } else {
        this.data_working_hour = []
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @computed get workingHours() {
    if (this.working_hour_loaded) {
      let final_result = {
        labels: this.data_working_hour.data.map(d => d.label),
        datasets: [
          {
            label: 'Hour',
            data: this.data_working_hour.data.map(d => d.total_hours),
            backgroundColor: 'rgba(241, 90, 34, 1)'
          },
          {
            label: 'Total Rate',
            data: this.data_working_hour.data.map(d => d.total_hours),
            type: 'line',
            pointRadius: 0,
            hoverRadius: 0
          }
        ]
      }
      return final_result
    } else {
      return {}
    }
  }

  @action
  async loadWorkerOverallInfo(range) {
    this.isLoading = true
    const url = `/api/v1/worker_dashboard/overall_info?range=${range}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.worker_info_loaded = true
        this.data_overall_info = response
      } else {
        this.data_overall_info = []
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

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
  getIssue = async range => {
    this.isLoading = true
    try {
      let url = `api/v1/daily_tasks/issues?range=${range}`
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
