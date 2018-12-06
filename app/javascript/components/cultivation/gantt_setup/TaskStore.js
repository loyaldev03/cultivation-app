import { observable, action, runInAction, toJS } from 'mobx'
import loadTask from './loadTask'
import { formatDate2, httpGetOptions, addDayToDate } from '../../utils'

class TaskStore {
  @observable tasks
  @observable isLoaded = false

  @action
  async loadTasks(batch_id) {
    let tasks = await loadTask.loadbatch(batch_id)
    this.tasks = tasks || []
    this.isLoaded = true
  }

  getGanttTasks() {
    return toJS(this.formatGantt(toJS(this.tasks)))
  }

  getTasks() {
    return toJS(this.tasks)
  }

  updateTask(task) {
    const found = this.tasks.find(x => x.id === task.id)
    if (found) {
      this.tasks = this.tasks.map(u => (u.id === task.id ? task : u))
    } else {
      this.tasks.push(task)
    }
  }

  deleteTask(task) {
    const found = this.tasks.find(x => x.id === task.id)
    if (found) {
      this.tasks = this.tasks.map(u => u.id !== task.id)
    } else {
      this.tasks.push(task)
    }
  }

  formatGantt(tasks) {
    if (this.isLoaded) {
      let formatted_tasks = tasks.map(task => {
        const { id, name, start_date, end_date, parent_id } = task.attributes
        return {
          id,
          name,
          start: start_date,
          end: end_date,
          dependencies: task.attributes.parent_id
            ? task.attributes.parent_id
            : task.attributes.depend_on,
          progress: parseInt(Math.random() * 100, 10)
        }
      })
      return formatted_tasks
    } else {
      return null
    }
  }
}

const taskStore = new TaskStore()

export default taskStore
