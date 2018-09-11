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
    this.plants.replace(newPlants.concat(this.plants.slice()))
  }

  @action
  add(newPlants = []) {
    // console.log(newPlants)
    // this.plants.concat(newPlants)

    newPlants.forEach(x => this.plants.push(x))
    // this.plants.push([{ attributes: { serial_no: 'xxx' }, id: `${this.plants.length + 1}` }].slice())
  }

  @action
  update(plant) {
    // find and replace...
  }


  @computed
  get motherPlants() {
    this.plants.slice().filter(x => x.attributes.plant_status === 'mother')
  }
}

const plantStore = new PlantStore()
export default plantStore
