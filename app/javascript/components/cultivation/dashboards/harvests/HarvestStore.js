import { observable, action } from 'mobx'
import { httpGetOptions } from '../../../utils'

class HarvestStore {
  @observable isLoading = false
  @observable average_harvest_cost = 0
  @observable average_harvest_yield = 0
  @observable avg_cost_load = false
  @observable avg_yield_load = false
  @observable harvest_cost_list_loaded = true
  @observable harvest_cost_list = []
  @observable harvest_yield_list = []
  @observable harvest_yield_list_loaded = true

  @action
  async loadAvgHarvestCost(order = 'top', facility_id) {
    this.isLoading = true
    const url = `/api/v1/dashboard_charts/harvest_cost?facility_id=${facility_id}&order=${order}`
    try {
      const data = await (await fetch(url, httpGetOptions)).json()
      if (data) {
        console.log(data)
        this.average_harvest_cost = data.average_harvest_cost
        this.avg_cost_load = true
        this.harvest_cost_list = data.harvest_cost
        this.harvest_cost_list_loaded = true
        this.isLoading = false
      } else {
        this.average_harvest_cost = 0
        this.isLoading = false
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadAvgHarvestYield(order = 'top', facility_id) {
    this.isLoading = true
    const url = `/api/v1/dashboard_charts/harvest_yield?facility_id=${facility_id}&order=${order}`
    try {
      const data = await (await fetch(url, httpGetOptions)).json()
      if (data) {
        this.average_harvest_yield = data.average_harvest_yield
        this.harvest_yield_list = data.harvest_yield
        this.harvest_yield_list_loaded = true
        this.avg_yield_load = true
        this.isLoading = false
      } else {
        this.average_harvest_yield = 0
        this.avg_yield_load = false
        this.isLoading = false
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
}
const harvestStore = new HarvestStore()

export default harvestStore
