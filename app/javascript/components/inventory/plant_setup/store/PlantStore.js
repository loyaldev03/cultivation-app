import { observable, action, computed } from 'mobx'

// Maybe facility store here instead with methods to
// 1. load/ reload,
// 2. return rooms base on facility id
// 3. retun sections base on room id
// 4. retun rows base on section or room id
// 5. retun shelves base on row
// 6. retun trays base on shelve id

class PlantStore {
  plants = observable([])
  @observable isLoading = false

  @action
  load(newPlants) {
    // console.log(newPlants)
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
    // console.log(index)
    if (index >= 0) {
      this.plants[index] = plant
    }
  }

  @computed
  get bindablePlants() {
    return this.plants.slice()
  }
}

const plantStore = new PlantStore()
export default plantStore
