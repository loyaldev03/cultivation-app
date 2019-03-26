import { observable, action, toJS, computed } from 'mobx'
import {
  httpPutOptions,
  httpGetOptions,
  httpPostOptions,
  httpDeleteOptions,
  sumBy,
  toast
} from '../../../utils'
import { addDays, differenceInCalendarDays, parse } from 'date-fns'

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

    // this.isLoading = true
    // const url = `https://api.upcitemdb.com/prod/trial/lookup?upc=752289793103`
    // const response = await await fetch(url, {
    //   headers: {
    //     Accept: 'application/json',
    //     'Access-Control-Allow-Origin': 'http://localhost:3000',
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Methods': 'GET',
    //     'Access-Control-Allow-Headers': 'Content-Type'
    //   }
    // })
    // console.log(response)
    // try {
    //   const response = await (await fetch(url)).json()
    //   console.log(response)
    //   if (response && response.data) {
    //     console.log(response)
    //     // const tasks = response.data.map(res => parseTask(res.attributes))
    //     // this.tasks = updateFlags(null, tasks)
    //     // this.isDataLoaded = true
    //   } else {
    //     // this.tasks = []
    //     // this.isDataLoaded = false
    //   }
    // } catch (error) {
    //   this.isDataLoaded = false
    //   console.log(error)
    //   Rollbar.error('Error Loading Item:', error)
    // } finally {
    //   this.isLoading = false
    // }
  }

  @computed get taskList() {
    if (this.isDataLoaded) {
      return this.tasks.filter(t => {
        const found = this.collapsedNodes.find(
          x => t.wbs.startsWith(x) && t.wbs !== x
        )
        return !found
      })
    } else {
      return []
    }
  }
}

const upcStore = new UpcStore()

export default upcStore
