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
  @observable data_unassigned_task = []
  @observable unassigned_task = false
  @observable schedule_list = []
  @observable schedule_date_range = []
  @observable performer_list = []
  @observable worker_capacity_loaded = false
  @observable cost_breakdown_loaded = false
  @observable schedule_list_loaded = false
  @observable schedule_date_range_loaded = false
  @observable performer_list_loaded = false

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

  @action
  async loadPerformerList(order = 'top', order_type = 'yield') {
    this.isLoading = true
    this.performer_list_loaded = false
    const url = `/api/v1/dashboard_charts/performer_list?order=${order}&order_type=${order_type}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.performer_list = response
        this.performer_list_loaded = true
      } else {
        this.performer_list = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
}

const chartStore = new ChartStore()

export default chartStore
