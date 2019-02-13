import { observable, action, runInAction, toJS } from 'mobx'
import { httpGetOptions, httpPostOptions, toast } from '../../utils'

class BatchStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable batches
  @observable batch

  @action
  async loadBatch(batchId) {
    this.isLoading = true
    const url = `/api/v1/batches/${batchId}/batch_info`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (response.data) {
          this.batch = response.data.attributes
          this.isDataLoaded = true
        } else {
          this.batch = ''
          this.isDataLoaded = false
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async loadBatches() {
    this.isLoading = true
    const url = '/api/v1/batches/list_infos'
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (response.data) {
          this.batches = response.data.map(rec => {
            return { ...rec.attributes, id: rec.id }
          })
          this.isDataLoaded = true
        } else {
          this.batches = []
          this.isDataLoaded = false
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async updateBatchName(name, batchId) {
    const url = `/api/v1/batches/${batchId}/update_batch_info`
    try {
      const payload = { name: name }
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        toast('Batch Updated', 'success')
      } else {
        console.error(response.errors)
      }
    } catch (err) {
      console.error(err)
    }
  }

  @action
  async updateBatchSelectedPlants(batchId) {
    const url = `/api/v1/batches/${batchId}/update_batch_info`
    try {
      const payload = {
        name: this.batch.name,
        selected_plants: toJS(this.batch.selected_plants)
      }
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        toast('Batch Updated', 'success')
      } else {
        console.error(response.errors)
      }
    } catch (err) {
      console.error(err)
    }
  }

  @action
  async deleteBatch(batchId) {
    const url = '/api/v1/batches/destroy'
    const payload = { id: batchId }
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      runInAction(() => {
        if (response.data) {
          this.batches = this.batches.filter(x => x.id !== response.data)
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  @action
  addPlantToBatch(plant_id, quantity) {
    const plant = this.batch.selected_plants.find(x => x.plant_id === plant_id)
    if (plant) {
      plant.quantity = quantity
      this.batch.selected_plants = this.batch.selected_plants.map(x =>
        x.plant_id === plant_id ? plant : x
      )
    } else {
      this.batch.selected_plants.push({
        plant_id,
        quantity
      })
    }
  }

  @action
  removePlantFromBatch(plant_id) {
    this.batch.selected_plants = this.batch.selected_plants.filter(
      x => x.plant_id !== plant_id
    )
  }
}

const batchStore = new BatchStore()

export default batchStore
