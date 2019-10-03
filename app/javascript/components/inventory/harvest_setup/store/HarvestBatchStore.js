import { observable, action, computed, autorun } from 'mobx'
import isEmpty from 'lodash.isempty'
import { httpGetOptions } from '../../../utils'
const uniq = require('lodash.uniq')

class HarvestBatchStore {
  @observable batches = []
  @observable filter = ''
  @observable isLoading = false
  @observable columnFilters = {}
  @observable metadata = {}
  @observable searchTerm = ''
  @observable filter = {
    facility_id: '',
    page: 0,
    limit: 20
  }

  constructor() {
    autorun(
      () => {
        if (this.filter.facility_id) {
          if (this.searchTerm === null) {
            this.searchTerm = ''
          }
          this.loadHarvestBatches()
        }
      },
      { delay: 700 }
    )
  }

  @action
  async loadHarvestBatches() {
    this.isLoading = true
    let apiUrl = `/api/v1/plants/harvests?facility_id=${
      this.filter.facility_id
    }`

    apiUrl += `&page=${this.filter.page}&limit=${this.filter.limit}&search=${
      this.searchTerm
    }`

    try {
      const response = await (await fetch(apiUrl, httpGetOptions)).json()
      if (response && response.data) {
        this.batches = response.data.map(x => x.attributes)
        this.metadata = Object.assign({ pages: 0 }, response.metadata)
        this.isDataLoaded = true
      } else {
        this.batches = []
        this.metadata = { pages: 0 }
        this.isDataLoaded = false
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  load(newBatches) {
    this.batches.replace(newBatches)
  }

  @action
  prepend(newBatch) {
    this.batches.replace([newBatch, ...this.batches.slice()])
  }

  @action
  update(batch) {
    const index = this.batches.findIndex(x => x.id === batch.id)
    if (index >= 0) {
      this.batches[index] = batch
    }
  }

  @computed
  get bindableBatches() {
    return this.batches.slice()
  }

  @computed
  get filteredList() {
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return this.batches.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const filterLc = this.searchTerm.toLowerCase()
        const field1 = `${b.harvest_name}`.toLowerCase()
        const results = field1.includes(filterLc)
        return results
      })
    } else {
      return this.batches
    }
  }

  /* + Required for column filter */
  isFiltered = record => {
    let f = Object.keys(this.columnFilters).find(key => {
      const filter = this.columnFilters[key].filter(x => x.value === false)
      return filter.find(x => x.label === record[key])
    })
    return f ? true : false
  }

  @action
  setFilter(filter) {
    this.filter = {
      facility_id: filter.facility_id,
      page: filter.page,
      limit: filter.limit
    }
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
  /* - Required for column filter */
}

const harvestBatchStore = new HarvestBatchStore()
export default harvestBatchStore
