import { observable, action, computed, toJS, get } from 'mobx'

class MaterialUsedStore {
  store = observable.map({})

  @action
  load(newMaterialUsedList = []) {
    console.group('newMaterialUsedList')
    console.log(newMaterialUsedList)
    console.groupEnd()

    newMaterialUsedList.forEach(x => {
      this.store.set(x.key, x)
    })
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
