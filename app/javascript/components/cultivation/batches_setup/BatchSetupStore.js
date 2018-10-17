import { observable, action, runInAction, toJS } from 'mobx'
import { sumBy, httpGetOptions } from '../../utils'

class BatchSetupStore {
  @observable isLoading = false
  @observable trays = []
  @observable plans = []
  @observable totalCapacity = 0
  @observable isReady = false

  @action
  async search(facilityId, monthYear) {
    if (facilityId && monthYear) {
      this.isLoading = true
      const api1Url = `/api/v1/batches/search_locations?facility_id=${facilityId}`
      const api2Url = `/api/v1/batches/search_tray_plans?search_month=${monthYear}`
      const api1Res = fetch(api1Url, httpGetOptions)
      const api2Res = fetch(api2Url, httpGetOptions)

      try {
        const response = await Promise.all([
          (await api1Res).json(),
          (await api2Res).json()
        ])
        runInAction(() => {
          this.isLoading = false
          if (response[0].data) {
            this.trays = response[0].data
            this.totalCapacity = sumBy(response[0].data, 'tray_capacity')
          }
          if (response[1].data) {
            this.plans = response[1].data.map(p => ({
              id: p.id,
              startDate: new Date(p.attributes.start_date),
              endDate: new Date(p.attributes.end_date),
              ...p.attributes
            }))
          }
          this.isReady = true
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  @action
  clearSearch() {
    this.trays = []
    this.plans = []
    this.totalCapacity = 0
    this.isReady = false
  }

  getCapacity(date) {
    const plansInScope = this.plans.filter(
      p =>
        (p.endDate >= date && p.startDate <= date) ||
        (p.startDate >= date && p.endDate <= date) ||
        (p.startDate <= date && p.endDate >= date)
    )
    if (this.isReady) {
      return this.totalCapacity - sumBy(plansInScope, 'capacity')
    } else {
      return '--'
    }
  }
}

const batchSetupStore = new BatchSetupStore()

export default batchSetupStore
