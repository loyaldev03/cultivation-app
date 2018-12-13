import { observable, action, computed } from 'mobx'

class NonSalesItemStore {
  items = observable([])
  @observable isLoading = false

  @action
  load(newItems) {
    this.items.replace(newItems)
  }

  @action
  prepend(newItem) {
    this.items.replace([newItem, ...this.items.slice()])
  }

  @action
  update(items) {
    const index = this.items.findIndex(x => x.id === item.id)
    if (index >= 0) {
      this.items[index] = item
    }
  }

  @computed
  get bindable() {
    return this.items.slice()
  }
}

const nonSalesItemStore = new NonSalesItemStore()
export default nonSalesItemStore
