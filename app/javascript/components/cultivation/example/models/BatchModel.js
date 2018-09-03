import { observable, computed, action } from 'mobx'

class BatchModel {
  id = Math.random()
  @observable batch_source
  @observable status = 'pending'

  constructor() {}

  @action
  update(status) {
    this.status = status
  }
}

const batchModel = new BatchModel()
export default batchModel
