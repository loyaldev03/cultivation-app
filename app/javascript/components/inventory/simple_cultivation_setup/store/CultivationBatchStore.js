import { observable, action, computed } from 'mobx'
import isEmpty from 'lodash.isempty'

class CultivationBatchStore {
  @observable isLoading = false
  @observable batches = []
  @observable filter = ''
  @observable columnFilters = {}

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
    const list = this.batches.map(x => x.attributes)
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return list.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const field1 = `${b.batch_no}`.toLowerCase()
        const field2 = `${b.name}`.toLowerCase()
        const filter = this.filter.toLowerCase()
        return field1.includes(filter) || field2.includes(filter)
      })
    } else {
      return list
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

  getPlantById(plantId) {
    if (plantId) {
      return toJS(this.plants.find(x => x.id === plantId))
    }
  }
}

const cultivationBatchStore = new CultivationBatchStore()
export default cultivationBatchStore
