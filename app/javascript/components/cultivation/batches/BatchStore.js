import { observable, action, runInAction, toJS } from 'mobx'
import { httpGetOptions, httpPostOptions } from '../../utils'

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
    } finally {
      this.isLoading = false
    }
  }

  @action
  async deleteBatch(batchId) {
    const url = '/api/v1/batches/destroy'
    const payload = { id: batchId }
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      runInAction(() => {
        if (response.data) {
          this.batches = this.batches.filter(x => x.id !== response.data)
        }
      })
    } catch (err) {
      console.error(err)
    }
  }
}

const batchStore = new BatchStore()

export default batchStore
