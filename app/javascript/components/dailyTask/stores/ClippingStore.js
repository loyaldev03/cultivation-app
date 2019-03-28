import { observable, action } from 'mobx'
import { httpGetOptions, httpPostOptions } from '../../utils'

class ClippingStore {
  @observable motherPlants = []
  @observable isLoading = false

  @action
  async fetchClippingData(batchId, taskId) {
    this.isLoading = true
    const url = `/api/v1/batches/plants_movement_history?batch_id=${batchId}&selected_plants=1`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response.data && response.data.attributes) {
        this.motherPlants = response.data.attributes.selected_plants
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      Rollbar.error('Error loading mother plants:', error)
    } finally {
      this.isLoading = false
    }
  }
}

const clippingStore = new ClippingStore()

export default clippingStore
