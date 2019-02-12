import { observable, action, computed, toJS } from 'mobx'

class PlantStore {
  plants = observable([])
  @observable isLoading = false

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
