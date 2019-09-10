import { observable, action, computed, toJS, autorun } from 'mobx'
import { httpGetOptions, formatDate, formatTime, httpPostOptions } from '../../../utils'
import isEmpty from 'lodash.isempty'

const uniq = require('lodash.uniq')

class HarvestPackageStore {
  @observable harvestPackages = []
  @observable isLoading = false
  @observable columnFilters = {}
  @observable filter = {
    facility_id: '',
  }
  @observable searchTerm = ''

  constructor() {
    autorun(
      () => {
        if (this.filter.facility_id) {
          if (this.searchTerm === null) {
            this.searchTerm = ''
          }
          this.loadHarvestPackages()
        }
      },
      { delay: 700 }
    )
  }

  @action
  setFilter(filter) {
    this.filter = {
      facility_id: filter.facility_id
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
    console.log(propName)
    return uniq(this.filteredList.map(x => x[propName]).sort())
  }

  @action
  async loadHarvestPackages() {
    this.isLoading = true
    const url = `/api/v1/sales_products/harvest_packages?facility_id=${this.filter.facility_id}&&search=${this.searchTerm}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.harvestPackages = response.data.map(x => x.attributes)
        this.isLoading = false
      } else {
        this.harvestPackages = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  load(harvestPackages) {
    this.harvestPackages.replace(harvestPackages)
  }

  @action
  prepend(harvestPackage) {
    this.harvestPackages.replace([
      harvestPackage,
      ...this.harvestPackages.slice()
    ])
  }

  @action
  update(harvestPackage) {
    const index = this.harvestPackages.findIndex(
      x => x.id === harvestPackage.id
    )
    if (index >= 0) {
      this.harvestPackages[index] = harvestPackage
    }
  }

  @action
  async createOrder(params) {
    const url = `/api/v1/purchase_orders`
    try {
      const response = await (await fetch(url, httpPostOptions(params))).json()
      if (response.data) {

        // this.loadTasks(batchId)
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.loadHarvestPackages()
    }
  }

  // @computed
  // get bindable() {
  //   return this.harvestPackages.slice()
  // }

  @computed
  get filteredList() {
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return this.harvestPackages.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const filterLc = this.searchTerm.toLowerCase()
        const nameLc = `${b.package_name}`.toLowerCase()
        const strainLc = `${b.strain}`.toLowerCase()
        const genomeLc = `${b.genome_type}`.toLowerCase()
        const results = nameLc.includes(filterLc) || strainLc.includes(filterLc) || genomeLc.includes(filterLc)
        return results
      })
    } else {
      return this.harvestPackages
    }
  }
}

const harvestPackageStore = new HarvestPackageStore()
export default harvestPackageStore
