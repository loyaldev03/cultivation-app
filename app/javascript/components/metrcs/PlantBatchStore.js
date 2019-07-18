import { action, observable, computed } from 'mobx'
import { toast } from '../utils/toast'
import { httpPostOptions, httpGetOptions } from '../utils'

class PlantBatchStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable batches = []

  @action
  async loadPlantBatches(batchId) {
    this.isLoading = false
    const url = `/api/v1/metrc/plant_batches/${batchId}`
    try {
      const resp = await (await fetch(url, httpGetOptions)).json()
      if (resp && resp.data) {
        this.batches = resp.data.map(x => x.attributes)
        this.isDataLoaded = true
      } else {
        this.isDataLoaded = false
      }
    } catch (e) {
      this.batches = []
      this.isDataLoaded = false
    } finally {
      this.isLoading = false
    }
  }

  @computed
  get filteredList() {
    return this.batches
  }
}

const plantBatchStore = new PlantBatchStore()

export default plantBatchStore
