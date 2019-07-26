import isEmpty from 'lodash.isempty'
import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions
} from '../utils'

function parseTask(taskAttributes) {
  return Object.assign(taskAttributes)
}

class FacilityDashboardStore {
  @observable data_facility_overview = []
  @observable facility_overview_loaded = false

  @action
  async loadFacilityOverview(facility_id) {
    this.isLoading = true
    this.facility_overview_loaded = false
    const url = `/api/v1/facility_dashboard_charts/facility_overview?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_facility_overview = response
        this.facility_overview_loaded = true
      } else {
        this.data_facility_overview = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  
}

const facilityDashboard = new FacilityDashboardStore()

export default facilityDashboard
