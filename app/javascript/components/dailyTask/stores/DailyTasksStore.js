import { observable, action, computed, toJS } from 'mobx'

class DailyTaskStore {
  batches = observable([])

  load(batches) {
    this.batches.replace(batches)
  }

  @computed
  get bindable() {
    return this.batches.slice()
  }
}

const dailyTasksStore = new DailyTaskStore()
export default dailyTasksStore
