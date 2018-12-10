import { observable, action, runInAction, toJS } from 'mobx'
import loadTask from './loadTask'
import { formatDate2, httpGetOptions, addDayToDate } from '../../utils'

class TaskStore {
  @observable tasks
  @observable isLoaded = false
  @observable hidden_ids = []

  @action
  async loadTasks(batch_id) {
    let tasks = await loadTask.loadbatch(batch_id)
    this.tasks = tasks || []
    this.isLoaded = true
  }

  getFilteredTask(tasks) {
    tasks = toJS(tasks)
    if (this.isLoaded) {
      console.log(tasks.filter(u => !this.hidden_ids.includes(u.id)))
      return tasks.filter(u => !this.hidden_ids.includes(u.id))
    } else {
      return []
    }
  }

  getGanttTasks() {
    return toJS(this.formatGantt(this.getFilteredTask(this.tasks)))
  }

  getTasks() {
    return toJS(this.getFilteredTask(this.tasks))
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

  setHiddenIds(parent_id) {
    let parent = this.tasks.find(e => e.id === parent_id)
    let children = this.tasks.filter(e => e.attributes.parent_id === parent.id)
    let children_ids = children.map(e => e.id)
    this.hidden_ids = this.hidden_ids.concat(children_ids)
  }

  clearHiddenIds(parent_id) {
    let parent = this.tasks.find(e => e.id === parent_id)
    let children = this.tasks
      .filter(e => e.attributes.parent_id === parent.id)
      .map(e => e.id)
    let new_ids = toJS(this.hidden_ids).filter(e => !children.includes(e))
    this.hidden_ids = new_ids
  }

  formatGantt(tasks) {
    tasks = toJS(tasks)
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
            : task.attributes.depend_on
          // progress: parseInt(Math.random() * 100, 10)
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
