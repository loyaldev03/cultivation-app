import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions
} from '../utils'

class ChartStore {
  @observable data_worker_capacity = []
  @observable worker_capacity_loaded = false

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
}

const chartStore = new ChartStore()

export default chartStore
