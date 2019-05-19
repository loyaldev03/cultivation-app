import { observable, action, computed, toJS } from 'mobx'
import isEmpty from 'lodash.isempty'
const uniq = require('lodash.uniq')

class PlantStore {
  @observable plants = []
  @observable isLoading = false
  @observable filter = ''
  @observable columnFilters = {}

  @action
  load(newPlants) {
    this.plants.replace(newPlants)
  }

  @action
  prepend(newPlants = []) {
    if (Array.isArray(newPlants)) {
      this.plants.replace(newPlants.concat(this.plants.slice()))
    } else {
      this.plants.replace([newPlants, ...this.plants.slice()])
    }
  }

  @action
  update(plant) {
    const index = this.plants.findIndex(x => x.id === plant.id)
    if (index >= 0) {
      this.plants[index] = plant
    }
  }

  @computed
  get bindablePlants() {
    return this.plants.slice()
  }

  @computed
  get filteredList() {
    const list = this.plants.map(x => x.attributes)
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return list.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const field1 = b.plant_id.toLowerCase()
        const field2 = b.strain_name.toLowerCase()
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
  getPlantsOptions() {
    return this.plants.map(p => ({
      value: p.id,
      label: p.attributes.plant_id
    }))
  }
}

const plantStore = new PlantStore()
export default plantStore
