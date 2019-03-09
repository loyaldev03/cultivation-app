import { observable, action, computed, toJS } from 'mobx'
import { httpGetOptions } from '../../../utils'

class RawMaterialStore {
  @observable isLoading = false
  @observable materials = []

  @action
  async load(materials = []) {
    this.materials = materials
  }

  @action
  prepend(newMaterial) {
    this.materials.replace([newMaterial, ...this.materials.slice()])
  }

  @action
  update(material) {
    const index = this.materials.findIndex(x => x.id === material.id)
    if (index >= 0) {
      this.materials = this.materials.map(x =>
        x.id === material.id ? material : x
      )
    } else {
      this.materials.push(material)
    }
  }

  @computed
  get bindable() {
    return this.materials.slice()
  }
}

const rawMaterialStore = new RawMaterialStore()
export default rawMaterialStore
