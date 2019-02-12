import { observable, action, runInAction, toJS } from 'mobx'
import { httpGetOptions } from '../../../utils'

class LocationStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable locations = []

  @action
  async loadLocations(facilityId) {
    this.isLoading = true
    const url = `/api/v1/facilities/${facilityId}/search_locations`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (response.data) {
          this.locations = response.data
          this.isDataLoaded = true
        } else {
          this.isDataLoaded = false
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoading = false
    }
  }
}

const locationStore = new LocationStore()

export default locationStore
