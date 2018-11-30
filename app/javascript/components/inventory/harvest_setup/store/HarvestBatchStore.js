import { observable, action, computed } from 'mobx'

class HarvestBatchStore {
  batches = observable([])
  @observable isLoading = false

  @action
  load(batches) {
    this.batches.replace(batches)
  }

  @action
  prepend(newBatch = []) {
    if (Array.isArray(newBatch)) {
      this.batches.replace(newBatch.concat(this.batches.slice()))
    } else {
      this.batches.replace([newBatch, ...this.batches.slice()])
    }
  }

  @action
  update(batch) {
    const index = this.batches.findIndex(x => x.id === batch.id)
    if (index >= 0) {
      this.batches[index] = batch
    }
  }

  @computed
  get bindableBatches() {
    return this.batches.slice()
  }
}

const batchestore = new HarvestBatchStore()
export default batchestore
