import { observable, action, runInAction, toJS } from 'mobx'
import { httpGetOptions } from '../../../utils'

class NutrientProfileStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable nutrients = []

  @action
  async loadNutrients(batchId, phases = '') {
    this.isDataLoaded = true
    const url = `/api/v1/batches/${batchId}/nutrient_profiles?phases=${phases}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response.data) {
        this.nutrients = response.data
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }
}

const nutrientProfileStore = new NutrientProfileStore()

export default nutrientProfileStore
