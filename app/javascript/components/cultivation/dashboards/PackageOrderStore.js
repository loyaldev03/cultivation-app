import { observable, action, computed, toJS, autorun } from 'mobx'
import {
  httpGetOptions,
  formatDate,
  formatTime,
  httpPostOptions
} from '../../utils'

class PackageOrderStore {
  @action
  async createOrder(params) {
    this.isLoading = true
    const url = `/api/v1/purchase_orders`
    try {
      const response = await (await fetch(url, httpPostOptions(params))).json()
      if (response.data) {
        // this.loadTasks(batchId)
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.error(error)
    } finally {
      // this.isLoading = false
    }
  }
}

const PackageOrderStore = new PackageOrderStore()
export default PackageOrderStore
