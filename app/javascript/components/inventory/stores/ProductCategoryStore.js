import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import { action, observable, computed, toJS } from 'mobx'
import { toast } from '../../utils/toast'
import { httpPostOptions, httpGetOptions } from '../../utils'

class ProductCategoryStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable columnFilters = {}
  @observable categories = []
  @observable defaultCategories = []
  @observable excludes = []

  @action
  async loadCategories(defaultCategories) {
    this.isLoading = true
    const url = '/api/v1/products/product_categories'
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.mergeCategories(response.data)
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
  mergeCategories(reponseData) {
    let results = reponseData.map(x => x.attributes)
    const names = results.map(x => x.name.toUpperCase())
    const defaultWithoutSaved = this.defaultCategories.filter(x => {
      return !names.includes(x.name.toUpperCase())
    })
    results = [...results, ...defaultWithoutSaved]
    results = results.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
    this.categories = results.sort(
      (a, b) => Number(b.is_active) - Number(a.is_active)
    )
  }

  @action
  async updateSubCategory(categoryName, updates) {
    this.isLoading = true
    const url = '/api/v1/products/product_categories/update_subcategory'
    const found = this.getCategoryByName(categoryName)
    const payload = found
      ? Object.assign({ product_category_id: found.id }, updates)
      : updates
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response && response.data) {
        const updated = response.data.attributes
        if (updated) {
          this.categories = this.categories.map(x => {
            return x.id === updated.id ? updated : x
          })
          if (updates.deleted) {
            toast('Record deleted', 'success')
          } else {
            toast(`${updates.name} saved.`, 'success')
          }
        }
      } else {
        console.warn(response)
      }
    } catch (error) {
      throw error
    } finally {
      this.isLoading = false
    }
  }

  @action
  async updateCategory(name, updates) {
    this.isLoading = true
    const found = this.getCategoryByName(name)
    const payload = found ? Object.assign(toJS(found), updates) : updates
    const url = '/api/v1/products/product_categories/update'
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response && response.data) {
        const updated = response.data.attributes
        const found = this.categories.find(x => x.name === updated.name)
        if (updated.deleted === true) {
          this.categories = this.categories.filter(x => x.name !== updated.name)
          toast(`${name} has been deleted`, 'success')
          return
        }
        if (!found) {
          // If new record push to array
          // TODO: check why push not working
          this.categories = [...this.categories, updated]
          toast(`${name} has been saved`, 'success')
          return
        }
        if (updated) {
          this.categories = this.categories.map(x => {
            return x.name === updated.name ? updated : x
          })
          const status = updated.is_active ? 'active' : 'inactive'
          toast(`${updated.name} is now ${status}`, 'success')
        }
      } else {
        console.warn(response)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  setDefaults(categories) {
    // Generate category to bind on ui from default categories.
    // when a default category is deleted by user, save it as deleted and inactive.
    categories.forEach((c, i) => {
      this.defaultCategories.push({
        id: i + 1,
        name: c,
        is_active: false
      })
    })
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
  get filteredListSubCategories() {
    let list = []
    if (this.isDataLoaded) {
      this.categories.forEach(x => {
        if (x.sub_categories) {
          list = list.concat(x.sub_categories)
        }
      })
    }
    return list
  }

  @computed
  get categoryOptions() {
    const res = this.categories
      .filter(c => c.is_active && !c.deleted && c.has_children)
      .map(c => {
        return {
          value: c.id,
          label: c.name,
          package_units: c.package_units
        }
      })
    return res
  }
  /* - column filters */
}

const productCategoryStore = new ProductCategoryStore()

export default productCategoryStore
