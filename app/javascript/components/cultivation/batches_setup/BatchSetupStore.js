import { observable, action, runInAction, toJS } from 'mobx'
import { addDays } from 'date-fns'
import {
  minBy,
  groupBy,
  sumBy,
  httpGetOptions,
  httpPostOptions
} from '../../utils'

// TODO: Handle veg | veg1 & veg2
const CULTIVATION_PHASES = ['clone', 'veg1', 'veg2', 'flower', 'dry', 'cure']

class BatchSetupStore {
  @observable searchMonth
  @observable isLoading = false
  @observable trays = {}
  @observable plans = {}
  @observable trayPurposes = []
  @observable isReady = false

  @action
  async search(searchParams, phaseDuration) {
    if (
      searchParams.facility_id &&
      searchParams.search_month &&
      searchParams.total_duration > 0
    ) {
      this.isLoading = true
      const api1Res = await fetch(
        `/api/v1/batches/search_locations?facility_id=${
          searchParams.facility_id
        }`,
        httpGetOptions
      )
      const api2Res = await fetch(
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
            const trayPurposes = CULTIVATION_PHASES.map(phase => ({
              phase,
              duration: phaseDuration[phase] || 0,
              totalCapacity: sumBy(traysData[phase], 'tray_capacity') // Total capacity for the phase in facility
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
              ...p.attributes,
              phase: p.attributes['phase'].toLowerCase()
            }))
            this.plans = groupBy(plansData, 'phase')
          }
          this.isReady = true
        })
      } catch (err) {
        this.isLoading = false
        this.isReady = false
        console.error(err)
      }
    }
  }

  @action
  async activateBatch(batchId, startDate) {
    try {
      const updateResponse = await fetch(
        `/api/v1/batches/${batchId}/update_batch`,
        httpPostOptions({
          action_type: 'activate',
          start_date: startDate
        })
      )
      const updateResult = await updateResponse.json()
      return updateResult
    } catch (error) {
      console.error(error)
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

  getSchedule(startDate, duration) {
    let nextDate = startDate
    const result = this.trayPurposes.map(purpose => {
      const phaseStartDate = nextDate
      const phaseLength = purpose.duration > 0 ? purpose.duration - 1 : 0
      const phaseEndDate = addDays(nextDate, phaseLength)
      nextDate = addDays(phaseEndDate, 1)
      const totalCapacity = purpose.totalCapacity
      const planCapacity = this.sumCapacity(
        this.plans[purpose.phase],
        phaseStartDate,
        phaseEndDate
      )
      return {
        phase: purpose.phase,
        totalCapacity,
        planCapacity,
        startDate: phaseStartDate,
        endDate: phaseEndDate,
        duration: purpose.duration,
        capacity: totalCapacity - planCapacity
      }
    })
    return result
  }

  getCapacity(startDate, duration) {
    const schedule = this.getSchedule(startDate, duration)
    const minResult = minBy(schedule, 'capacity')
    return minResult
  }
}

const batchSetupStore = new BatchSetupStore()

export default batchSetupStore
