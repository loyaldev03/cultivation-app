import { observable, action, computed } from 'mobx'

class TaskStore {
  tasks = observable([])

  @action
  load(tasks) {
    this.tasks.replace(tasks)
  }

  @computed
  get bindable() {
    return this.tasks.slice()
  }
}

const taskStore = new TaskStore()
export default taskStore
