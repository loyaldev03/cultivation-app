import { observable, action, runInAction, toJS } from 'mobx'
import {
  minBy,
  groupBy,
  sumBy,
  httpGetOptions,
  httpPostOptions
} from '../../utils'

class BatchSetupStore {
  @observable isLoading = false
  @observable trays = {}
  @observable plans = {}
  @observable trayPurposes = {}
  @observable isReady = false

  @action
  async search(searchParams) {
    console.log('perform search')
    if (
      searchParams.facility_id &&
      searchParams.search_month &&
      searchParams.total_duration > 0
    ) {
      this.isLoading = true
      const api1Res = fetch(
        `/api/v1/batches/search_locations?facility_id=${
          searchParams.facility_id
        }`,
        httpGetOptions
      )
      const api2Res = fetch(
        `/api/v1/batches/search_batch_plans`,
        httpPostOptions(searchParams)
      )

      try {
        const response = await Promise.all([
          (await api1Res).json(),
          (await api2Res).json()
        ])
        runInAction(() => {
          this.isLoading = false
          // Facility's trays
          if (response[0].data) {
            const traysData = groupBy(response[0].data, 'tray_purpose')
            delete traysData.mother
            const trayPurposes = Object.keys(traysData).map(phase => ({
              phase,
              totalCapacity: sumBy(traysData[phase], 'tray_capacity')
            }))
            this.trayPurposes = trayPurposes
            this.trays = traysData
          }
          // Tray's booking plans
          if (response[1].data) {
            const plansData = response[1].data.map(p => ({
              id: p.id,
              startDate: new Date(p.attributes.start_date),
              endDate: new Date(p.attributes.end_date),
              ...p.attributes
            }))
            // console.table(plansData)
            this.plans = groupBy(plansData, 'phase')
          }
          this.isReady = true
        })
      } catch (err) {
        this.isLoading = false
        console.error(err)
      }
    }
  }

  @action
  clearSearch() {
    this.trays = {}
    this.plans = {}
    this.isReady = false
  }

  sumCapacity(phasePlans, startDate, endDate) {
    if (phasePlans) {
      const plansInScope = phasePlans.filter(
        p =>
          (p.endDate >= startDate && p.startDate <= endDate) ||
          (p.startDate >= startDate && p.startDate <= endDate) ||
          (p.startDate <= startDate && p.endDate >= endDate)
      )
      return sumBy(plansInScope, 'capacity')
    } else {
      return 0
    }
  }

  getCapacity(startDate, endDate) {
    const result = this.trayPurposes.map(purpose => {
      const totalCapacity = purpose.totalCapacity
      const planCapacity = this.sumCapacity(
        this.plans[purpose.phase],
        startDate,
        endDate
      )
      return {
        phase: purpose.phase,
        totalCapacity,
        planCapacity,
        capacity: totalCapacity - planCapacity
      }
    })
    const minResult = minBy(result, 'capacity')
    // console.log({startDate})
    // console.table(result)
    return minResult
  }
}

const batchSetupStore = new BatchSetupStore()

export default batchSetupStore
