import isEmpty from 'lodash.isempty'
import { observable, action, computed } from 'mobx'
import { httpGetOptions, httpPostOptions } from '../../utils'

class ClippingStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable motherPlants = []
  @observable movements = []

  @action
  async fetchClippingData(batchId, phase, activity) {
    this.isLoading = true
    try {
      const url = `/api/v1/batches/plants_movement_history?batch_id=${batchId}&phase=${phase}&activity=${activity}`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response.data && response.data.attributes) {
        const { selected_plants, movements } = response.data.attributes
        this.motherPlants = selected_plants
        this.movements = movements
        this.isDataLoaded = true
      } else {
        this.isDataLoaded = false
        console.error(response.errors)
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error('Error loading mother plants:', error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async updateClippings(args) {
    const found = this.movements.find(
      x => x.mother_plant_code === args.mother_plant_code
    )
    let newHist
    if (found) {
      newHist = { ...found, plants: args.plants }
      this.movements = this.movements.map(x =>
        x.mother_plant_code === found.mother_plant_code ? newHist : x
      )
    } else {
      newHist = {
        activity: args.activity,
        mother_plant_id: args.mother_plant_id,
        mother_plant_code: args.mother_plant_code,
        phase: args.phase,
        plants: args.plants
      }
      this.movements = [...this.movements, newHist]
    }
    const url = `/api/v1/batches/${args.batch_id}/update_plants_movement`
    const response = await (await fetch(url, httpPostOptions(args))).json()
    if (response.errors) {
      console.error(response.errors)
    }
  }

  @action
  async deleteClippings({
    batch_id,
    task_id,
    mother_plant_id,
    mother_plant_code,
    clipping_code
  }) {
    const found = this.movements.find(
      x => x.mother_plant_code === mother_plant_code
    )
    if (found) {
      const newHist = found.plants.filter(t => t !== clipping_code)
      await this.updateClippings({
        batch_id,
        task_id,
        mother_plant_id,
        mother_plant_code,
        plants: newHist
      })
    }
  }

  getPlantMovements(motherPlantCode) {
    const res = this.movements.find(
      x => x.mother_plant_code === motherPlantCode
    )
    return isEmpty(res) ? [] : res.plants
  }

  get totalClippings() {
    return this.movements.reduce((acc, obj) => acc + obj.plants.length, 0)
  }

  get totalQuantity() {
    return this.motherPlants.reduce((acc, obj) => acc + obj.quantity, 0)
  }
}

const clippingStore = new ClippingStore()

export default clippingStore
