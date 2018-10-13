import { observable, action, computed } from 'mobx'

class CultivationBatchStore {
  batches = observable([])
  @observable isLoading = false

  @action
  load(newBatches) {
    this.batches.replace(newBatches)
  }

  @action
  prepend(newBatch) {
    this.batches.replace([newBatch, ...this.batches.slice()])
  }

  @action
  update(batch) {
    const index = this.batches.findIndex(x => x.id === batch.id)
    console.log(index)
    if (index >= 0) {
      this.batches[index] = batch
      // this.batches.remove(this.batches[index])
      // this.prepend(batch)
    }
  }

  @computed
  get bindableBatches() {
    return this.batches.slice()
  }
}

const cultivationBatchStore = new CultivationBatchStore()
export default cultivationBatchStore