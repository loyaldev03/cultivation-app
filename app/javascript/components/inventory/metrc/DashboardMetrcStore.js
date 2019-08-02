import isEmpty from 'lodash.isempty'
import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions
} from '../../utils'

function parseTask(taskAttributes) {
  return Object.assign(taskAttributes)
}

class DashboardMetrcStore {
  @observable data_metrcs_info = []
  @observable metrc_tags_loaded = false

  @action
  async loadMetrcs_info(facility_id) {
    this.isLoading = true
    this.metrc_tags_loaded = false
    const url = `/api/v1/metrc?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_metrcs_info = response
        this.batches_info_loaded = true
      } else {
        this.data_metrcs_info = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async updateDisposed(facility_id, metrc_id) {
    this.isLoading = true
    this.metrc_tags_loaded = false
    const url = `/api/v1/metrc/metrc_disposed?facility_id=${facility_id}&&m_id=${metrc_id}`
    try {
      const response = await (await fetch(url, httpPutOptions)).json()
      if (response) {
        this.data_metrcs_info = response
        this.batches_info_loaded = true
      } else {
        this.data_metrcs_info = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
}



const dashboardMetrcStore = new DashboardMetrcStore()

export default dashboardMetrcStore
