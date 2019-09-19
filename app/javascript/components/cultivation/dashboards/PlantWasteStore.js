import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import { observable, action, runInAction, computed, toJS } from 'mobx'
import { httpGetOptions, httpPostOptions, toast } from '../../utils'

class PlantWasteStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable plants
  @observable filter = ''
  @observable columnFilters = {}

  @action
  async loadPlants(facility_id) {
    this.isLoading = true
    const url = `/api/v1/plants/plant_waste?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (response.data) {
          this.plants = response.data.map(rec => {
            return { ...rec.attributes, id: rec.id }
          })
          this.isDataLoaded = true
        } else {
          this.plants = []
          this.isDataLoaded = false
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoading = false
    }
  }

  @action
  getSelected() {
    return toJS(this.plants.selected_plants)
  }


  @computed
  get filteredList() {
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return this.plants.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const batchNoLc = `${b.name || ''} ${b.batch_no}`.toLowerCase()
        const strainLc = b.strain_name.toLowerCase()
        const filterLc = this.filter.toLowerCase()
        const result = this.filter
          // batchNoLc.includes(filterLc) || strainLc.includes(filterLc)
        return result
      })
    } else {
      return this.plants
    }
  }

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
