import { observable, action, runInAction, toJS } from 'mobx'
import loadTask from './loadTask'
import { formatDate2, httpGetOptions, addDayToDate, toast } from '../../utils'

class TaskStore {
  @observable tasks
  @observable batch_id
  @observable isLoaded = false
  @observable hidden_ids = []
  @observable processing = false
  @observable collapsedNodes = []

  @action
  async loadTasks(batch_id) {
    let tasks = await loadTask.loadbatch(batch_id)
    this.tasks = tasks || []
    this.isLoaded = true
    this.batch_id = batch_id
  }

  @action
  toggleCollapseNode(wbs) {
    const found = this.collapsedNodes.find(i => i === wbs)
    if (found) {
      this.collapsedNodes = this.collapsedNodes.filter(i => i !== wbs)
    } else {
      this.collapsedNodes.push(wbs)
    }
  }

  getFilteredTask(tasks) {
    tasks = toJS(tasks)
    if (this.isLoaded) {
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

  getProcessing() {
    return toJS(this.processing)
  }

  updateDependency(destination_id, source_id) {
    let url = `/api/v1/batches/${
      this.batch_id
    }/tasks/${destination_id}/update_dependency?destination_id=${destination_id}&source_id=${source_id}`

    fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.data && data.data.id != null) {
          toast('Task Updated', 'success')
          this.loadTasks(this.batch_id)
          this.processing = false
        } else {
          toast(data.errors, 'error')
        }
      })
  }

  isCollapsed(wbs) {
    const found = this.collapsedNodes.find(x => x === wbs)
    return !!found
  }

  hasChildNode(wbs) {
    const childNodeFormat = wbs + '.'
    const found = this.tasks.find(
      t => t.wbs.startsWith(childNodeFormat) && t.wbs !== wbs
    )
    return !!found
  }

  updateTask(task) {
    this.processing = true
    let new_task = task
    let id = task.id
    let end_date = task['_end']
    let start_date = task['_start']
    const found = toJS(this.tasks.find(x => x.id === task.id))
    if (found) {
      // this.tasks = this.tasks.map(u => (u.id === task.id ? task : u))

      let url = `/api/v1/batches/${this.batch_id}/tasks/${id}`
      let task = {
        assigned_employee: found.assigned_employee,
        batch_id: found.batch_id,
        days_from_start_date: found.days_from_start_date,
        depend_on: found.depend_on,
        duration: found.duration,
        end_date: end_date,
        start_date: start_date,
        estimated_hours: found.estimated_hours,
        id: id,
        is_category: found.is_category,
        is_phase: found.is_phase,
        name: found.name,
        parent_id: found.parent_id,
        phase: found.phase,
        position: found.position,
        task_category: found.task_category,
        time_taken: found.time_taken,
        task_type: found.task_type
      }

      fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ task: task }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.data && data.data.id != null) {
            toast('Task Updated', 'success')
            this.loadTasks(this.batch_id)
            this.processing = false
          } else {
            toast(data.errors, 'error')
          }
        })
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
    let children = this.tasks.filter(e => e.parent_id === parent.id)
    let children_ids = children.map(e => e.id)
    let children_2_ids = this.tasks
      .filter(e => children_ids.includes(e.parent_id))
      .map(e => e.id)
    this.hidden_ids = this.hidden_ids.concat(
      children_ids.concat(children_2_ids)
    )
  }

  clearHiddenIds(parent_id) {
    let parent = this.tasks.find(e => e.id === parent_id)
    let children = this.tasks
      .filter(e => e.parent_id === parent.id)
      .map(e => e.id)
    let children2 = this.tasks
      .filter(e => children.includes(e.parent_id))
      .map(e => e.id)
    children = children.concat(children2)
    let new_ids = toJS(this.hidden_ids).filter(e => !children.includes(e))
    this.hidden_ids = new_ids
  }

  formatGantt(tasks) {
    tasks = toJS(tasks)
    if (this.isLoaded) {
      let formatted_tasks = tasks.map(task => {
        const { id, name, start_date, end_date, parent_id } = task
        return {
          id,
          name,
          start: start_date,
          end: end_date,
          custom_class: this.getCustomClass(task),
          dependencies: this.getDependencies(task)
          // progress: parseInt(Math.random() * 100, 10)
        }
      })
      return formatted_tasks
    } else {
      return null
    }
  }

  getCustomClass(task) {
    if (task.is_phase === true) {
      return 'phase'
    }
    if (task.is_category === true) {
      return 'category'
    }
    if (task.is_category === false && task.is_phase === false) {
      return 'task'
    }
  }

  getDependencies(task) {
    // if (task.id === '5c0f63a1fb83872228537c91') {
    //   return '5c0f63a1fb83872228537c8b'
    // } else {
    return task.depend_on
    // ? task.depend_on
    // : task.parent_id
    // }
  }
}

const taskStore = new TaskStore()

export default taskStore
