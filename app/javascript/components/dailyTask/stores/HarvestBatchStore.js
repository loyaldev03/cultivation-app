import { observable, action, computed, toJS, get } from 'mobx'
import { httpPostOptions, httpGetOptions } from '../../utils'

class HarvestBatchStore {
  @observable uom = ''
  @observable totalPlants = 0 // total number of alive plants in this batch
  @observable harvestBatchName = '' // harvest batch name
  @observable totalWeighted = 0 // number of plants weighted in this system
  @observable totalWetWasteWeight = 0 // number of wet waste
  @observable totalDryWeight = 0 // number of dry weight
  @observable totalTrimWeight = 0 // number of trim weight
  @observable totalTrimWasteWeight = 0 // number of trim waste weight

  @action
  async load(batchId) {
    const url = `/api/v1/daily_tasks/${batchId}/harvest_batch_status`
    try {
      const data = await (await fetch(url, httpGetOptions)).json()
      if (data) {
        this.uom = data.uom
        this.totalPlants = data.total_plants
        this.harvestBatchName = data.harvest_batch_name
        this.totalWeighted = data.total_weighted
        this.totalWetWasteWeight = data.total_wet_waste_weight
        this.totalDryWeight = data.total_dry_weight
        this.totalTrimWeight = data.total_trim_weight
        this.totalTrimWasteWeight = data.total_trim_waste_weight
      }
    } catch (error) {
      console.log(error)
    }
  }

  @action
  saveWeight(batchId, plantTd, weight) {
    const payload = { weight, plant_id: plantTd }

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
          data
        }
      })
  }

  @action
  saveWasteWeight(batchId, weight, indelible) {
    const payload = { weight, indelible }
    return fetch(
      `/api/v1/daily_tasks/${batchId}/save_weight`,
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
          this.totalWetWasteWeight = data.total_wet_waste_weight
        }

        return {
          success: status == 200,
          data
        }
      })
  }
}

const harvestBatchStore = new HarvestBatchStore()
export default harvestBatchStore
