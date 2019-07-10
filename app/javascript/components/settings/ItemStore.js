import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import { action, observable, computed } from 'mobx'
import { toast } from '../utils/toast'
import { httpPostOptions, httpGetOptions } from '../utils'

class ItemStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable columnFilters = {}
  @observable items = []

  @action
  async loadItems(facilityId) {
    this.isLoading = false
    const url = `/api/v1/products/items?facility_id=${facilityId}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.items = response.data.map(x => x.attributes)
        this.isDataLoaded = true
      } else {
        this.isDataLoaded = false
      }
    } catch (error) {
      this.items = []
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  /* + column filters */
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

  @computed
  get filteredList() {
    if (!isEmpty(this.columnFilters)) {
      return this.items.filter(b => {
        return !this.isFiltered(b)
      })
    } else {
      return this.items
    }
  }
  /* - column filters */
}

const itemStore = new ItemStore()

export default itemStore
