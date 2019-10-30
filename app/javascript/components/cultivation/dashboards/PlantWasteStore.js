import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import { observable, action, runInAction, computed, toJS, autorun } from 'mobx'
import { httpGetOptions, httpPostOptions, toast } from '../../utils'

class PlantWasteStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable plants = []
  @observable metadata = {}
  @observable columnFilters = {}
  @observable searchTerm = ''
  @observable filter = {
    facility_strain_id: '',
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
          this.loadPlants()
        }
      },
      { delay: 700 }
    )
  }

  @action
  async loadPlants() {
    this.isLoading = true
    let apiUrl = `/api/v1/plants/plant_waste?facility_id=${this.filter.facility_id}`

    apiUrl += `&page=${this.filter.page}&limit=${this.filter.limit}&search=${
      this.searchTerm
    }`

    try {
      const response = await (await fetch(apiUrl, httpGetOptions)).json()
      if (response && response.data) {
        this.plants = response.data.map(x => x)
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
  getSelected() {
    return toJS(this.plants.selected_plants)
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
        const results = field1.includes(filterLc)
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

  @action
  async updateBatchName(name, batchId) {
    const url = `/api/v1/batches/${batchId}/update_batch_info`
    try {
      const payload = { name: name }
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        toast('Batch Updated', 'success')
      } else {
        console.error(response.errors)
      }
    } catch (err) {
      console.error(err)
    }
  }

  @action
  async updateBatchSelectedPlants(batchId, locationSelected) {
    const url = `/api/v1/batches/${batchId}/update_batch_info`
    try {
      const payload = {
        name: this.batch.name,
        selected_plants: toJS(this.batch.selected_plants),
        selected_location: locationSelected // TODO: get the selected location that the user clicked.
      }
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        toast('Batch Updated', 'success')
      } else {
        console.error(response.errors)
      }
    } catch (err) {
      console.error(err)
    }
  }

  @action
  async deleteBatch(batchId) {
    const url = '/api/v1/batches/destroy'
    const payload = { id: batchId }
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      runInAction(() => {
        if (response.data) {
          this.batches = this.batches.filter(x => x.id !== response.data)
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  @action
  addPlantToBatch(plant_id, quantity) {
    const plant = this.batch.selected_plants.find(x => x.plant_id === plant_id)
    if (plant) {
      plant.quantity = quantity
      this.batch.selected_plants = this.batch.selected_plants.map(x =>
        x.plant_id === plant_id ? plant : x
      )
    } else {
      this.batch.selected_plants.push({
        plant_id,
        quantity
      })
    }
  }

  @action
  setOnePlant(plant_id, quantity) {
    this.batch.selected_plants = this.batch.selected_plants.map(storePlant => {
      if (storePlant.plant_id === plant_id) {
        storePlant.quantity = parseInt(quantity)
      }
      return storePlant
    })
  }
  @action
  setAllPlants(plantArr) {
    // this.batch.selected_plants = plantArr
    plantArr.map(allMotherPlant => {
      this.batch.selected_plants = this.batch.selected_plants.map(
        storePlant => {
          if (storePlant.plant_id === allMotherPlant.plant_id) {
            storePlant.quantity = allMotherPlant.quantity
          }
          return storePlant
        }
      )
      return plantArr
    })
  }

  @action
  removePlantFromBatch(plant_id) {
    this.batch.selected_plants = this.batch.selected_plants.filter(
      x => x.plant_id !== plant_id
    )
  }
}

const plantWasteStore = new PlantWasteStore()

export default plantWasteStore
