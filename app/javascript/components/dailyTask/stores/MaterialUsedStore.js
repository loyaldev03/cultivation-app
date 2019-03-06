import { observable, action, computed, toJS, get } from 'mobx'

class MaterialUsedStore {
  store = observable.map({})
  @observable nutrientIds = []

  @action
  load(newMaterialUsedList = []) {
    console.group('newMaterialUsedList')
    console.log(newMaterialUsedList)
    console.groupEnd()

    newMaterialUsedList.forEach(x => {
      this.store.set(x.key, x)
    })
  }

  @action
  loadNutrientsCatalogue(nutrientIds) {
    this.nutrientIds.replace(nutrientIds)
  }

  shouldShowTarget(catalogue_id) {
    return this.nutrientIds.indexOf(catalogue_id) >= 0
  }

  get(key) {
    const data = this.store.get(key)
    if (data) {
      return data
    } else {
      return {}
    }
  }

  update(key, record) {
    this.store.set(key, record)
  }
}

const materialUsedStore = new MaterialUsedStore()
export default materialUsedStore
