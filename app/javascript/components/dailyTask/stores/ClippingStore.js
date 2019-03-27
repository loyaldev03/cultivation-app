import { observable, action } from 'mobx'
import { httpGetOptions, httpPostOptions } from '../../utils'

class ClippingStore {
  @observable motherPlants = []
  @observable isLoading = false

  @action
  async fetchClippingData(batchId, taskId) {
    this.isLoading = true
    // TODO: Change to real API endpoint
    const url = `http://localhost:3000/api/v1/batches/5c5265df8c24bd19df581c89/nutrient_profiles`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response.data) {
        this.motherPlants = [
          {
            plantId: '5c5265b18c24bd19df581c85',
            plantTag: 'M0AK0192',
            plantLocation: 'M01.S1.R1.Sh1.T3',
            scannedPlants: [],
            quantityRequired: 10
          },
          {
            plantId: '5c5265b18c24bd19df581c86',
            plantTag: 'M0AK0193',
            plantLocation: 'M02.S1.R1.Sh1.T4',
            scannedPlants: [],
            quantityRequired: 10
          },
          {
            plantId: '5c5265b18c24bd19df581c87',
            plantTag: 'M0AK0194',
            plantLocation: 'M01.S1.R1.Sh1.T5',
            scannedPlants: ['ABC123', 'ABC234', 'ABC3245'],
            quantityRequired: 5
          }
        ]
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
