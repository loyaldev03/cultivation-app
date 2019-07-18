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

class BatchStore {
  @observable data_batch_distribution = []
  @observable data_batches_info = []
  @observable batch_distribution_loaded = false
  @observable batches_info_loaded = false

  @action
  async loadBatches_info(facility_id) {
    this.isLoading = true
    this.batches_info_loaded = false
    const url = `/api/v1/dashboard_charts/batches_info?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_batches_info = response
        this.batches_info_loaded = true
      } else {
        this.data_batches_info = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
  
  @action
  async loadBatchDistribution(date, label) {
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
            label: 'Batch',
            data: this.data_batch_distribution.map(d => d.batch_count),
            backgroundColor: 'rgba(241, 90, 34, 1)'
          },
          {
            label: 'Plant',
            data: this.data_batch_distribution.map(d => d.plant_count),
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
}

const batchStore = new BatchStore()

export default batchStore
