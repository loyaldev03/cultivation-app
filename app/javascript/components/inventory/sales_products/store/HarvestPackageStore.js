import { observable, action, computed, toJS } from 'mobx'

class HarvestPackageStore {
  harvestPackages = observable([])
  @observable isLoading = false

  @action
  load(harvestPackages) {
    this.harvestPackages.replace(harvestPackages)
  }

  @action
  prepend(harvestPackage) {
    this.harvestPackages.replace([
      harvestPackage,
      ...this.harvestPackages.slice()
    ])
  }

  @action
  update(harvestPackage) {
    const index = this.harvestPackages.findIndex(
      x => x.id === harvestPackage.id
    )
    if (index >= 0) {
      this.harvestPackages[index] = harvestPackage
    }
  }

  @computed
  get bindable() {
    return this.harvestPackages.slice()
  }
}

const harvestPackageStore = new HarvestPackageStore()
export default harvestPackageStore
