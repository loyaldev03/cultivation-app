import { observable, action, runInAction, toJS } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  toast
} from '../../utils'

class PackageOrderStore {
  @observable package_orders
  @observable next_order_no

  @action
  async loadPackageOrder() {
    this.isLoading = true
    const url = `/api/v1/sales_package_orders`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (response.data) {
          this.package_orders = response.data.map(rec => {
            return { ...rec.attributes, id: rec.id }
          })
          console.log(toJS(this.package_orders))
          this.isDataLoaded = true
        } else {
          this.batch = ''
          this.isDataLoaded = false
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoading = false
    }
  }


  @action
  async createOrder(params) {
    this.isLoading = true
    const url = `/api/v1/sales_package_orders`
    try {
      const response = await (await fetch(url, httpPostOptions(params))).json()
      if (response.data) {
        toast('Order created', 'success')
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async getNextOrderNo() {
    this.isLoading = true
    const url = `/api/v1/sales_package_orders/get_next_order_no`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (response.data) {
          this.next_order_no = response.data
          this.isDataLoaded = true
        } else {
          this.batch = ''
          this.isDataLoaded = false
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoading = false
    }
  }

}

const pos = new PackageOrderStore()
export default pos
