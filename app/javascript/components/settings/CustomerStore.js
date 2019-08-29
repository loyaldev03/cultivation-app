import { action, observable, computed, autorun } from 'mobx'
import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import { httpGetOptions, httpPostOptions } from '../utils'

class CustomerStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable columnFilters = {}
  @observable items = []
  @observable customer = []

  @action
  async loadCustomer() {
    this.isLoading = false
    const url = `/api/v1/customers/`
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
  async getCustomer(id) {
    this.isLoading = false
    const url = `/api/v1/customers/${id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.customer = response.data.attributes
        this.isDataLoaded = true
      } else {
        this.isDataLoaded = false
      }
    } catch (error) {
      this.customer = []
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async saveCustomer(data) {
    return fetch('/api/v1/customers', {
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

  customers = observable([])

  @action
  load(customers) {
    this.customers.replace(customers)
  }

  @action
  prepend(customer) {
    this.customers.replace([customer, ...this.customers.slice()])
  }

  @action
  update(customer) {
    const index = this.customer.findIndex(
      x => x.attributes.id === customer.attributes.id
    )
    this.customers[index] = customer
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

const customerStore = new CustomerStore()
export default customerStore
