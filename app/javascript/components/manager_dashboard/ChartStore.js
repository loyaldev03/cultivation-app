import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions
} from '../utils'

function parseTask(taskAttributes) {
  return Object.assign(taskAttributes)
}

class ChartStore {
  @observable data_worker_capacity = []
  @observable data_cost_breakdown = []
  @observable data_batch_distribution = []
  @observable data_unassigned_task = []
  @observable unassigned_task = false
  @observable schedule_list = []
  @observable schedule_date_range = []
  @observable worker_capacity_loaded = false
  @observable cost_breakdown_loaded = false
  @observable batch_distribution_loaded = false
  @observable schedule_list_loaded = false
  @observable schedule_date_range_loaded = false

  @action
  async loadWorkerCapacity(batchId) {
    this.isLoading = true
    this.worker_capacity_loaded = false
    const url = `/api/v1/dashboard_charts/worker_capacity?batch_id=${batchId}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_worker_capacity = response
        this.worker_capacity_loaded = true
      } else {
        this.data_worker_capacity = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async UnassignedTask() {
    this.isLoading = true
    this.unassigned_task = false
    const url = `/api/v1/dashboard_charts/unassigned_task`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_unassigned_task = response
        this.unassigned_task = true
      } else {
        this.data_unassigned_task = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadBatchDistribution(date,label) {
    this.isLoading = true
    this.batch_distribution_loaded = false
    const url = `/api/v1/dashboard_charts/batch_distribution?date=${date}&label=${label}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_batch_distribution = response
        this.batch_distribution_loaded = true
      } else {
        this.data_batch_distribution = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @computed get batchDistribution() {
    if (this.batch_distribution_loaded) {
      let final_result = {
        labels: this.data_batch_distribution.map(d => d.phase),
        datasets: [
          {
            label: "Batch",
            data: this.data_batch_distribution.map(d => d.batch_count),
            backgroundColor: "rgba(241, 90, 34, 1)"
          },
          {
            label: "Plant",
            data:  this.data_batch_distribution.map(d => d.plant_count),
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
  async loadCostBreakdown(month, year) {
    this.isLoading = true
    this.cost_breakdown_loaded = false
    const url = `/api/v1/dashboard_charts/cost_breakdown?month=${month}&year=${year}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_cost_breakdown = response
        this.cost_breakdown_loaded = true
      } else {
        this.data_cost_breakdown = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @computed get costBreakdown() {
    if (this.cost_breakdown_loaded) {
      let final_result = {
        labels: ['Materials', 'Labor', 'Water', 'Electricity'],
        datasets: [
          {
            data: this.data_cost_breakdown.map(e => e.value),
            backgroundColor: ['#a29cfe', '#4a69bd', '#efaa1a', '#00b894'],
            hoverBackgroundColor: ['#a29cfe', '#4a69bd', '#efaa1a', '#00b894']
          }
        ]
      }

      return final_result
    } else {
      return {}
    }
  }

  @action
  async loadScheduleList(date) {
    console.log(date)
    this.isLoading = true
    this.schedule_list_loaded = false
    const url = `/api/v1/dashboard_charts/tasklist_by_day?date=${date}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.schedule_list = response.map(res => parseTask(res.attributes))
        this.schedule_list_loaded = true
      } else {
        this.schedule_list = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadScheduleDateRange(start_date, end_date) {
    this.isLoading = true
    this.schedule_date_range_loaded = false
    const url = `/api/v1/dashboard_charts/tasks_by_date_range?start_date=${start_date}&end_date=${end_date}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.schedule_date_range = response
        this.schedule_date_range_loaded = true
      } else {
        this.schedule_date_range = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
}

const chartStore = new ChartStore()

export default chartStore
