import { observable, action, runInAction, toJS } from 'mobx'
import loadTask from './loadTask'

class TaskStore {

  @observable tasks
  @observable isLoaded = false

  @action
  async loadTasks(batch_id){
    let tasks = await loadTask.loadbatch(batch_id)
    this.tasks = tasks || []
    console.table(tasks)
    this.isLoaded = true
  }

  getTasks(){
    return toJS(this.tasks)
  }

  updateTask(task){
    const found = this.tasks.find(x => x.id === task.id)
    if (found) {
      this.tasks = this.tasks.map(u => (u.id === task.id ? task : u))
    } else {
      this.tasks.push(task)
    }
  }

}

const taskStore = new TaskStore()

export default taskStore