import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions
} from '../utils'

class ChartStore {
  @observable data_worker_capacity = []
  @observable data_cost_breakdown = []
  @observable worker_capacity_loaded = false
  @observable cost_breakdown_loaded = false


  @action
  async loadWorkerCapacity(batchId) {
    this.isLoading = true
    this.worker_capacity_loaded = false
    const url = `/api/v1/charts/worker_capacity?batch_id=${batchId}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        // const tasks = response.data.map(res => parseTask(res.attributes))
        console.log(response)
        this.data_worker_capacity = response
        this.worker_capacity_loaded = true
        console.log('finish')
      } else {
        this.data_worker_capacity = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }


  @action
  async loadCostBreakdown(month, year) {
    month = 'July'
    year = '2019'

    this.isLoading = true
    this.cost_breakdown_loaded = false
    const url = `/api/v1/charts/cost_breakdown?month=${month}&year=${year}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        // const tasks = response.data.map(res => parseTask(res.attributes))
        console.log(response)
        this.data_cost_breakdown = response
        this.cost_breakdown_loaded = true
        console.log('finish')
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
        labels: [
          'Materials',
          'Labor',
          'Water',
          'Electricity'
        ],
        datasets: [{
          data: this.data_cost_breakdown.map(e => e.value),
          backgroundColor: [
            '#a29cfe',
            '#4a69bd',
            '#efaa1a',
            '#00b894'
          ],
          hoverBackgroundColor: [
            '#a29cfe',
            '#4a69bd',
            '#efaa1a',
            '#00b894'
          ]
        }]
      }

      return final_result
    } else {
      return {}
    }
  }


}

const chartStore = new ChartStore()

export default chartStore
