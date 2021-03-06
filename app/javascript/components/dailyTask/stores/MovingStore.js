import isEmpty from 'lodash.isempty'
import { observable, action, computed } from 'mobx'
import { httpGetOptions, httpPostOptions } from '../../utils'

class MovingStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable selectedLocations = []
  @observable movements = []

  @action
  async fetchMovingData(batchId, phase, activity) {
    this.isLoading = true
    this.phase = phase
    try {
      const url = `/api/v1/batches/plants_movement_history?batch_id=${batchId}&phase=${phase}&activity=${activity}&selected_trays=1`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response.data && response.data.attributes) {
        const { selected_trays, movements } = response.data.attributes
        this.selectedLocations = selected_trays
        this.movements = movements
        this.isDataLoaded = true
      } else {
        this.isDataLoaded = false
        console.error(response.errors)
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error('Error loading booked trays:', error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async updateMovings(args) {
    const found = this.movements.find(
      x => x.destination_code === args.destination_code
    )
    let newHist
    if (found) {
      newHist = { ...found, plants: args.plants }
      this.movements = this.movements.map(x =>
        x.destination_code === found.destination_code ? newHist : x
      )
    } else {
      newHist = {
        activity: args.activity,
        destination_id: args.destination_id,
        destination_code: args.destination_code,
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
  async deleteClippings(args) {
    console.log('deleteClippings:', args)
  }

  getPlantMovements(trayCode) {
    if (!trayCode) {
      throw new Error('Invalid Tray Code')
    }
    const res = this.movements.find(x => x.destination_code === trayCode)
    return isEmpty(res) ? [] : res.plants
  }

  @computed
  get totalPlants() {
    return this.movements.reduce((acc, obj) => acc + obj.plants.length, 0)
  }

  @computed
  get totalCapacity() {
    return this.selectedLocations.reduce((acc, obj) => acc + obj.capacity, 0)
  }

  @computed
  get taskCompleted() {
    return this.totalPlants === this.totalCapacity
  }
}

const movingStore = new MovingStore()

export default movingStore
