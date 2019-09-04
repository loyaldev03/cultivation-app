import { observable, action, computed, toJS } from 'mobx'
import { httpGetOptions, formatDate, formatTime } from '../../../utils'
import isEmpty from 'lodash.isempty'

const uniq = require('lodash.uniq')

class HarvestPackageStore {
  @observable harvestPackages = []
  @observable isLoading = false
  @observable columnFilters = {}
  @observable filter = ''
  @observable searchTerm = ''

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
  async loadHarvestPackages(facility_id) {
    this.isLoading = true
    const url = `/api/v1/sales_products/harvest_packages?facility_id=${facility_id}`
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
        const results = nameLc.includes(filterLc)
        return results
      })
    } else {
      return this.harvestPackages
    }
  }
}

const harvestPackageStore = new HarvestPackageStore()
export default harvestPackageStore
