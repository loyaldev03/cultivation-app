import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import { action, observable, computed } from 'mobx'
import { toast } from '../../utils/toast'
import { httpPutOptions, httpPostOptions, httpGetOptions } from '../../utils'

class CatalogStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable columnFilters = {}
  @observable catalogues = []
  @observable excludes = []

  @action
  async loadCatalogues(catalogue_type, category) {
    this.isLoading = true
    const url = `/api/v1/catalogues?catalogue_type=${catalogue_type}&category=${category}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.catalogues = response.data.map(x => x.attributes)
        this.isDataLoaded = true
      } else {
        this.isDataLoaded = false
      }
    } catch (error) {
      this.catalogues = []
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async updateCatalog(id, isActive) {
    this.isLoading = true
    const url = `/api/v1/catalogues/${id}`
    try {
      const params = { is_active: isActive }
      const response = await (await fetch(url, httpPutOptions(params))).json()
      if (response && response.data) {
        this.catalogues = this.catalogues.map(x =>
          x.id === response.data.id ? response.data.attributes : x
        )
        const cat = {
          name: response.data.attributes.name,
          status: response.data.attributes.is_active ? 'active' : 'inactive'
        }
        toast(`${cat.name} is now ${cat.status}`, 'success')
      } else {
        console.warn(response)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  getCatalogueByName(name) {
    const found = this.catalogues.find(x => x.name === name)
    return found
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
      return this.catalogues.filter(b => {
        return !this.isFiltered(b)
      })
    } else {
      return this.catalogues
    }
  }

  @computed
  get weightOptions() {
    const res = this.catalogues
      .filter(
        c =>
          !this.excludes.includes(c.name) &&
          c.quantity_type === 'WeightBased' &&
          c.is_active
      )
      .map(c => {
        return {
          value: c.name,
          label: c.name
        }
      })
    return res
  }
  /* - column filters */
}

const catalogStore = new CatalogStore()

export default catalogStore
