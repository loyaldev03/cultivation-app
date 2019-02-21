import { observable, action, computed, toJS } from 'mobx'

class DailyTaskStore {
  dailyTasks = observable([])

  load(tasks) {
    this.dailyTasks.replace(tasks)
  }

  @computed
  bindable() {
    return this.dailyTasks.slice()
  }
}

const dailyTasksStore = new DailyTaskStore()
export default dailyTasksStore