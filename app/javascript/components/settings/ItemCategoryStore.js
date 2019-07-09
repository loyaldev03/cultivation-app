import isEmpty from 'lodash.isempty'
import { action, observable, computed } from 'mobx'
import { toast } from '../utils/toast'
import { httpPostOptions, httpGetOptions } from '../utils'

class ItemCategoryStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable columnFilters = {}
  @observable categories = []
  @observable excludes = []

  @action
  async loadCategories() {
    this.isLoading = true
    const url = '/api/v1/products/item_categories'
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.categories = response.data.map(x => x.attributes)
        this.isDataLoaded = true
      } else {
        this.isDataLoaded = false
      }
    } catch (error) {
      this.categories = []
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async updateCategory(id, isActive) {
    this.isLoading = true
    const url = `/api/v1/products/item_categories/${id}/update`
    try {
      const params = { is_active: isActive }
      const response = await (await fetch(url, httpPostOptions(params))).json()
      if (response && response.data) {
        this.categories = this.categories.map(x =>
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

  getCategoryByName(name) {
    const found = this.categories.find(x => x.name === name)
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
      return this.categories.filter(b => {
        return !this.isFiltered(b)
      })
    } else {
      return this.categories
    }
  }

  @computed
  get selectOptions() {
    const res = this.categories
      .filter(c => !this.excludes.includes(c.name))
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

const categoryStore = new ItemCategoryStore()

export default categoryStore
