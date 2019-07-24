import { observable, action } from 'mobx'
import { httpGetOptions } from '../../../utils'

class HarvestStore {
  @observable isLoading = false
  @observable average_harvest_cost = 0
  @observable average_harvest_yield = 0
  @observable avg_cost_load = false
  @observable avg_yield_load = false
  @observable harvest_cost_list_loaded = true
  @observable harvest_cost_list
  @observable harvest_yield_list
  @observable harvest_yield_list_loaded = true

  @action
  async loadAvgHarvestCost(facility_id) {
    this.isLoading = true
    const url = `/api/v1/dashboard_charts/harvest_cost?facility_id=${facility_id}`
    try {
      const data = await (await fetch(url, httpGetOptions)).json()
      if (data) {
        this.average_harvest_cost = data.average_harvest_cost
        this.avg_cost_load = true
        this.isLoading = false
      } else {
        this.average_harvest_cost = 0
        this.isLoading = true
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadAvgHarvestYield(facility_id) {
    this.isLoading = true
    const url = `/api/v1/dashboard_charts/harvest_yield?facility_id=${facility_id}`
    try {
      const data = await (await fetch(url, httpGetOptions)).json()
      if (data) {
        this.average_harvest_yield = data.average_harvest_yield
        this.avg_yield_load = true
        this.isLoading = false
      } else {
        this.average_harvest_yield = 0
        this.avg_yield_load = false
        this.isLoading = true
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadHarvestCost(order = 'top', facility_id) {
    this.isLoading = true
    this.harvest_cost_list_loaded = false
    const url = `/api/v1/dashboard_charts/harvest_cost?facility_id=${facility_id}&&order=${order}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.harvest_cost_list = response.harvest_cost
        this.harvest_cost_list_loaded = true
      } else {
        this.harvest_cost_list = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadHarvestYield(order = 'top', facility_id) {
    this.isLoading = true
    this.harvest_yield_list_loaded = false
    const url = `/api/v1/dashboard_charts/harvest_yield?facility_id=${facility_id}&&order=${order}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.harvest_yield_list = response.harvest_yield
        this.harvest_yield_list_loaded = true
      } else {
        this.harvest_yield_list = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
}
const harvestStore = new HarvestStore()

export default harvestStore
