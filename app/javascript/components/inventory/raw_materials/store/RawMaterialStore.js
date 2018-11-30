import { observable, action, computed } from 'mobx'

class RawMaterialStore {
  materials = observable([])
  @observable isLoading = false

  @action
  load(newMaterials) {
    this.materials.replace(newMaterials)
  }

  @action
  prepend(newMaterial) {
    this.materials.replace([newMaterial, ...this.materials.slice()])
  }

  @action
  update(material) {
    const index = this.materials.findIndex(x => x.id === material.id)
    if (index >= 0) {
      this.materials[index] = material
    }
  }

  @computed
  get bindable() {
    return this.materials.slice()
  }
}

const rawMaterialStore = new RawMaterialStore()
export default rawMaterialStore
