import { observable, action, toJS, computed } from 'mobx'
import {
  httpGetOptions
} from '../../../utils'

class UpcStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable items = []
  @observable item

  @action
  async loadItem(upc) {
    this.isLoading = true
    const url = `/api/v1/products/upc?upc=${upc}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.item = response.data
        return toJS(this.item)
      } else {
        return {}
      }
    } catch (error) {
      this.isDataLoaded = false
      Rollbar.error('Error Loading Product List:', error)
    } finally {
      this.isLoading = false
    }
  }

  getItem() {
    return toJS(this.item)
  }

}

const upcStore = new UpcStore()

export default upcStore
