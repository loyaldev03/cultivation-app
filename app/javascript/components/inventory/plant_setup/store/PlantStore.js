import { observable, action, computed, toJS } from 'mobx'

class PlantStore {
  @observable plants = []
  @observable isLoading = false
  @observable filter = ''

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
    if (this.filter) {
      return list.filter(b => {
        const field1 = b.plant_id.toLowerCase()
        const field2 = b.strain_name.toLowerCase()
        const filter = this.filter.toLowerCase()
        return field1.includes(filter) || field2.includes(filter)
      })
    } else {
      return list
    }
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
