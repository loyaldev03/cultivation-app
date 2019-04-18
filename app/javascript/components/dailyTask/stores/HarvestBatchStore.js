import { observable, action, computed, toJS, get } from 'mobx'
import { httpPostOptions, httpGetOptions } from '../../utils'

class HarvestBatchStore {
  @observable uom = ""
  @observable totalPlants = 0   // total number of alive plants in this batch
  @observable totalWeighted = 0 // number of plants weighted in this system

  @action
  load(batchId) {
    fetch(`/api/v1/daily_tasks/${batchId}/harvest_batch_status`, httpGetOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.uom = data.uom
        this.totalPlants = data.total_plants
        this.totalWeighted = data.total_weighted
      })
  }

  @action
  saveWeight(batchId, plantTd, weight) {
    const payload = { weight, plant_id: plantTd }
    console.log(payload)

    return fetch(`/api/v1/daily_tasks/${batchId}/save_harvest_batch_weight`, httpPostOptions(payload))
      .then(response => {
        return response.json().then(d => ({
          data: d,
          status: response.status
        }))
      })
      .then(({status, data}) => {
        console.log(data)
        this.totalPlants = data.total_plants
        this.totalWeighted = data.total_weighted

        return {
          success: status == 200,
          data
        }
      })
  }
}

const harvestBatchStore = new HarvestBatchStore()
export default harvestBatchStore
