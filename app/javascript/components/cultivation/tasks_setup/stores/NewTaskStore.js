import { observable, action, runInAction, toJS, computed } from 'mobx'
import loadTask from '../actions/loadTask'
import {
  formatDate2,
  httpGetOptions,
  httpPostOptions,
  addDayToDate,
  toast
} from '../../../utils'

class TaskStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable collapsedNodes = []
  @observable tasks = []

  @action
  async loadTasks(batchId) {
    this.isLoading = true
    const url = `/api/v1/batches/${batchId}/tasks`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      this.isLoading = false
      this.tasks = response.data.map(res => {
        return {
          ...res.attributes
        }
      })
      this.isDataLoaded = true
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    }
  }

  @action
  async updateTaskPosition(batchId, taskId, position) {
    this.isLoading = true
    const url = `/api/v1/batches/${batchId}/tasks/${taskId}/update_position`
    try {
      const response = await fetch(url, httpPostOptions({ task: { position } }))
      this.loadTasks(batchId)
    } catch (error) {
      console.error(error)
    }
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

  @computed get taskList() {
    if (this.isDataLoaded) {
      return this.tasks.filter(t => {
        const found = this.collapsedNodes.find(
          x => t.wbs.startsWith(x) && t.wbs !== x
        )
        return !found
      })
    } else {
      return []
    }
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

  getGanttTasks() {
    return toJS(this.formatGantt(this.taskList))
  }

  updateDependency(batch_id, destination_id, source_id) {
    let url = `/api/v1/batches/${batch_id}/tasks/${destination_id}/update_dependency?destination_id=${destination_id}&source_id=${source_id}`

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
          this.loadTasks(batch_id)
          this.processing = false
        } else {
          toast(data.errors, 'error')
        }
      })
  }

  updateTask(batch_id, task) {
    this.processing = true
    let new_task = task
    let id = task.id
    let end_date = task['_end']
    let start_date = task['_start']
    const found = toJS(this.tasks.find(x => x.id === task.id))
    if (found) {
      // this.tasks = this.tasks.map(u => (u.id === task.id ? task : u))

      let url = `/api/v1/batches/${batch_id}/tasks/${id}`
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
            this.loadTasks(batch_id)
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

  formatGantt(tasks) {
    tasks = toJS(tasks)
    if (this.isDataLoaded) {
      let formatted_tasks = tasks.map(task => {
        const { id, name, start_date, end_date, parent_id } = task
        return {
          id,
          name,
          start: start_date,
          end: end_date,
          dependencies: this.getDependencies(task)
        }
      })
      return formatted_tasks
    } else {
      return null
    }
  }

  getDependencies(task) {
    return task.depend_on
  }
}

const taskStore = new TaskStore()

export default taskStore
