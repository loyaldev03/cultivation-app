import { observable, action, toJS } from 'mobx'

class StrainStore {
  strains = observable([])
  @observable isLoading = false

  @action
  load(strains) {
    // console.log(newPlants)
    this.strains.replace(strains)
  }

  @action
  prepend(strain) {    
    this.strains.replace([strain, ...this.strains.slice()])
  }

  @action
  update(strain) {
    const index = this.strains.findIndex(x => x.attributes.id === strain.attributes.id)
    this.strains[index] = strain
  }
}

const strainStore = new StrainStore()
export default strainStore
