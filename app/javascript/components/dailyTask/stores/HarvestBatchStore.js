import { observable, action, computed, toJS, get } from 'mobx'
import { httpPostOptions, httpGetOptions } from '../../utils'
import isEmpty from 'lodash.isempty'

const uniq = require('lodash.uniq')

class HarvestBatchStore {
  harvestBatches = observable([])
  @observable isLoading = false
  @observable uom = ''
  @observable totalPlants = 0 // total number of alive plants in this batch
  @observable harvestBatchName = '' // harvest batch name
  @observable totalWeighted = 0 // number of plants weighted in this system
  @observable totalWetWasteWeight = 0 // number of wet waste
  @observable totalDryWeight = 0 // number of dry weight
  @observable totalTrimWeight = 0 // number of trim weight
  @observable totalTrimWasteWeight = 0 // number of trim waste weight
  @observable filter = ''
  @observable columnFilters = {}

  @action
  async load(batchId) {
    const url = `/api/v1/daily_tasks/${batchId}/harvest_batch_status`
    try {
      const data = await (await fetch(url, httpGetOptions)).json()
      if (data) {
        this.uom = data.uom
        this.totalPlants = data.total_plants
        this.harvestBatchName = data.harvest_batch_name
        this.totalWeighted = data.total_weighted
        this.totalWetWasteWeight = data.total_wet_waste_weight
        this.totalDryWeight = data.total_dry_weight
        this.totalTrimWeight = data.total_trim_weight
        this.totalTrimWasteWeight = data.total_trim_waste_weight
        this.totalCureWeight = data.total_cure_weight
      }
    } catch (error) {
      console.log(error)
    }
  }

  @action
  async loadAll() {
    this.isLoading = true
    const url = `/api/v1/harvests`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        const harvestBatches = response.data
        this.harvestBatches.replace(harvestBatches)
        console.log(response)
        this.isLoading = false
      } else {
        this.tasks = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  saveWeight(batchId, plantId, weight, override) {
    const payload = { weight, plant_id: plantId, override }

    return fetch(
      `/api/v1/daily_tasks/${batchId}/save_harvest_batch_weight`,
      httpPostOptions(payload)
    )
      .then(response => {
        return response.json().then(d => ({
          data: d,
          status: response.status
        }))
      })
      .then(({ status, data }) => {
        if (status === 200) {
          this.totalPlants = data.total_plants
          this.totalWeighted = data.total_weighted
        }

        return {
          success: status == 200,
          data: data,
          errors: data.errors
        }
      })
  }

  @action
  saveWasteWeight(batchId, weight, indelible) {
    const payload = { weight, indelible }
    return fetch(
      `/api/v1/daily_tasks/${batchId}/save_weight`,
      httpPostOptions(payload)
    )
      .then(response => {
        return response.json().then(d => ({
          data: d,
          status: response.status
        }))
      })
      .then(({ status, data }) => {
        if (status === 200) {
          this.totalWetWasteWeight = data.total_wet_waste_weight
        }

        return {
          success: status == 200,
          data
        }
      })
  }


  @computed
  get filteredList() {
    const list = this.harvestBatches.map(x => x.attributes)
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return list.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const field1 = b.harvest_name.toString()
        const field2 = b.strain_name.toLowerCase()
        const filter = this.filter.toLowerCase()
        return field1.includes(filter) || field2.includes(filter)
      })
    } else {
      return list
    }
  }

  isFiltered = record => {
    let f = Object.keys(this.columnFilters).find(key => {
      const filter = this.columnFilters[key].filter(x => x.value === false)
      return filter.find(x => x.label === record[key])
    })
    return f ? true : false
  }

  updateFilterOptions = (propName, filterOptions) => {
    const updated = {
      ...this.columnFilters,
      [propName]: filterOptions
    }
    this.columnFilters = updated
  }

  getUniqPropValues = propName => {
    return uniq(this.filteredList.map(x => x[propName]).sort())
  }

}

const harvestBatchStore = new HarvestBatchStore()
export default harvestBatchStore
