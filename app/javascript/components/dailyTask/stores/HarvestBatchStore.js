import { observable, action, computed, toJS, get } from 'mobx'
import { httpPostOptions, httpGetOptions } from '../../utils'

class HarvestBatchStore {
  @observable uom = ''
  @observable totalPlants = 0 // total number of alive plants in this batch
  @observable totalWeighted = 0 // number of plants weighted in this system

  @action
  load(batchId) {
    fetch(`/api/v1/daily_tasks/${batchId}/harvest_batch_status`, httpGetOptions)
      .then(response => response.json())
      .then(data => {
        this.uom = data.uom
        this.totalPlants = data.total_plants
        this.totalWeighted = data.total_weighted
      })
  }

  @action
  saveWeight(batchId, plantTd, weight, override) {
    const payload = { weight, plant_id: plantTd, override }

    return fetch(
      `/api/v1/daily_tasks/${batchId}/save_harvest_batch_weight`,
      httpPostOptions(payload)
    )
      .then(response => {
        return response.json().then(d => ({
          data: d,
          status: response.status
        }))
      })
      .then(({ status, data }) => {
        if (status === 200) {
          this.totalPlants = data.total_plants
          this.totalWeighted = data.total_weighted
        }

        return {
          success: status == 200,
          data: data,
          errors: data.errors
        }
      })
  }
}

const harvestBatchStore = new HarvestBatchStore()
export default harvestBatchStore
