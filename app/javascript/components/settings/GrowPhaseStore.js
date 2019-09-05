import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import { action, observable, computed } from 'mobx'
import { toast } from '../utils/toast'
import { httpPostOptions, httpGetOptions } from '../utils'

class GrowPhaseStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable columnFilters = {}
  @observable items = []
  @observable grow_phase = []

  @action
  async loadGrowPhase() {
    this.isLoading = false
    const url = `/api/v1/grow_phases/`
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

  @action
  async getGrowPhase(id) {
    this.isLoading = false
    const url = `/api/v1/grow_phases/${id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.grow_phase = response.data.attributes
        this.isDataLoaded = true
      } else {
        this.isDataLoaded = false
      }
    } catch (error) {
      this.grow_phase = []
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async saveGrowPhase(data) {
    return fetch(`/api/v1/grow_phases/${data.id}/update`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json().then(data => {
          return {
            status: response.status,
            data
          }
        })
      })
      .then(result => {
        const { status, data } = result
        if (status == 200) {
          if (data.id) {
            this.update(data.data)
          } else {
            this.prepend(data.data)
          }
        }

        return result
      })
  }

  @action
  async updateCategory(id, isActive) {
    this.isLoading = true
    const url = `/api/v1/grow_phases/${id}/update`
    try {
      const params = { is_active: isActive }
      const response = await (await fetch(url, httpPostOptions(params))).json()
      if (response && response.data) {
        this.items = this.items.map(x =>
          x.id === response.data.id ? response.data.attributes : x
        )
        const item = {
          name: response.data.attributes.name,
          status: response.data.attributes.is_active ? 'active' : 'inactive'
        }
        toast(`${item.name} is now ${item.status}`, 'success')
      } else {
        console.warn(response)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  grow_phases = observable([])

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
  
  @action
  prepend(grow_phase) {
    this.grow_phases.replace([grow_phase, ...this.grow_phases.slice()])
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

const growPhaseStore = new GrowPhaseStore()

export default growPhaseStore
