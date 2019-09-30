import { observable, action, computed, toJS, autorun } from 'mobx'
import isEmpty from 'lodash.isempty'
const uniq = require('lodash.uniq')
import { httpGetOptions } from '../../../utils'

class PlantStore {
  @observable plants = []
  @observable isLoading = false
  @observable columnFilters = {}
  @observable metadata = {}
  @observable searchTerm = ''
  @observable filter = {
    facility_strain_id: '',
    current_growth_stage: '',
    facility_id: '',
    excludes: [],
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
          this.loadPlants()
        }
      },
      { delay: 700 }
    )
  }

  @action
  async loadPlants() {
    this.isLoading = true
    let apiUrl = '/api/v1/plants/all'

    if (
      this.filter.current_growth_stage &&
      this.filter.current_growth_stage.length > 0
    ) {
      apiUrl = apiUrl + '/' + this.filter.current_growth_stage
    }
    if (facility_id && this.filter.facility_strain_id) {
      if (this.filter.facility_strain_id.length > 0) {
        apiUrl =
          apiUrl + '?facility_strain_id=' + this.filter.facility_strain_id
      }
      if (this.filter.facility_id.length > 0) {
        apiUrl = apiUrl + '&facility_id=' + this.filter.facility_id
      }
    } else {
      if (
        this.filter.facility_strain_id &&
        this.filter.facility_strain_id.length > 0
      ) {
        apiUrl =
          apiUrl + '?facility_strain_id=' + this.filter.facility_strain_id
      }
      if (this.filter.facility_id && this.filter.facility_id.length > 0) {
        apiUrl = apiUrl + '?facility_id=' + this.filter.facility_id
      }
    }

    if (!isEmpty(this.filter.excludes)) {
      apiUrl = apiUrl + `&excludes=${this.filter.excludes}`
    }

    apiUrl += `&page=${this.filter.page}&limit=${this.filter.limit}&search=${
      this.searchTerm
    }`

    try {
      const response = await (await fetch(apiUrl, httpGetOptions)).json()
      if (response && response.data) {
        this.plants = response.data
        this.metadata = Object.assign({ pages: 0 }, response.metadata)
        this.isDataLoaded = true
      } else {
        this.plants = []
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
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return this.plants.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const filterLc = this.searchTerm.toLowerCase()
        const field1 = `${b.plant_id}`.toLowerCase()
        const field2 = `${b.plant_tag}`.toLowerCase()
        const results = field1.includes(filterLc) || field2.includes(filterLc)
        return results
      })
    } else {
      return this.plants
    }
  }

  @action
  setFilter(filter) {
    this.filter = {
      facility_id: filter.facility_id,
      excludes: filter.excludes,
      current_growth_stage: filter.current_growth_stage,
      page: filter.page,
      limit: filter.limit
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
      label: p.plant_id
    }))
  }
}

const plantStore = new PlantStore()
export default plantStore
