import { observable, action } from 'mobx'
import { httpGetOptions, httpPostOptions } from '../../utils'

class ClippingStore {
  @observable motherPlants = []
  @observable isLoading = false

  @action
  async fetchClippingData(batchId, phase, activity) {
    this.isLoading = true
    try {
      const url = `/api/v1/batches/plants_movement_history?batch_id=${batchId}&phase=${phase}&activity=${activity}`
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

  @action
  async updateClippings(args) {
    // batchId, taskId, motherPlantId, clippings
    this.isLoading = true
    try {
      const url = `/api/v1/batches/${args.batch_id}/update_plants_movement`
      const payload = args
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        console.log(response.data)
        // this.motherPlants = response.data.attributes.selected_plants
      } else {
        console.log(response)
        console.error(response.errors)
      }
    } catch (error) {
      throw error
    } finally {
      this.isLoading = false
    }
  }
}

const clippingStore = new ClippingStore()

export default clippingStore
