import { observable, action, runInAction, toJS } from 'mobx'
import { httpGetOptions } from '../../utils'

class BatchStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable batches

  @action
  async loadBatches() {
    this.isLoading = true
    const url = '/api/v1/batches/list_infos'
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        this.isLoading = false
        if (response.data) {
          this.batches = response.data.map(rec => {
            return { ...rec.attributes, id: rec.id }
          })
          this.isDataLoaded = true
        } else {
          this.batches = []
          this.isDataLoaded = false
        }
      })
    } catch (err) {
      console.error(err)
    }
  }
}

const batchStore = new BatchStore()

export default batchStore
