import { observable, action, runInAction, toJS, computed } from 'mobx'
import {
  formatDate2,
  httpPutOptions,
  httpGetOptions,
  httpPostOptions,
  httpDeleteOptions,
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
  async updateTaskPosition(batchId, taskId, targetPositionTaskId) {
    this.isLoading = true
    const url = `/api/v1/batches/${batchId}/tasks/${taskId}/update_position`
    try {
      const payload = { target_position_task_id: targetPositionTaskId }
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        await this.loadTasks(batchId)
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async updateTaskIndent(batchId, taskId, indentInOut) {
    this.isLoading = true
    const url = `/api/v1/batches/${batchId}/tasks/${taskId}/update_indent`
    try {
      const payload = { indent_action: indentInOut }
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        this.loadTasks(batchId)
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async deleteTask(batchId, id) {
    console.log('delete task')
    const url = `/api/v1/batches/${batchId}/tasks/${id}`
    try {
      const response = await (await fetch(url, httpDeleteOptions())).json()
      if (response.errors && response.errors.id) {
        toast(data.errors.id, 'error')
      } else {
        toast('Task has been deleted', 'success')
        this.loadTasks(batchId)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
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

  getTaskById(id) {
    return toJS(this.tasks.find(x => x.id === id))
  }

  getChildren(nodeWbs) {
    const childWbs = nodeWbs + '.'
    return this.tasks.filter(t => t.wbs.startsWith(childWbs))
  }

  haveChildren(nodeWbs) {
    const childWbs = nodeWbs + '.'
    return this.tasks.some(t => t.wbs.startsWith(childWbs))
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

  @action
  async updateDependency(batch_id, destination_id, source_id) {
    this.isLoading = true

    const url = `/api/v1/batches/${batch_id}/tasks/${destination_id}/update_dependency`
    const payload = { destination_id, source_id }
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      await this.loadTasks(batch_id)
      this.isLoading = false
    } catch (error) {
      console.log(error)
    }
  }

  @action
  updateSingleTask(batchId, taskId, updateObj) {
    let url = `/api/v1/batches/${batchId}/tasks/${taskId}`

    let task = {
      assigned_employee: state.assigned_employee,
      batch_id: state.batch_id,
      days_from_start_date: state.days_from_start_date,
      depend_on: state.depend_on,
      duration: state.duration,
      end_date: state.end_date,
      estimated_hours: state.estimated_hours,
      id: state.id,
      is_category: state.is_category,
      is_phase: state.is_phase,
      name: state.name,
      parent_id: state.parent_id,
      phase: state.phase,
      position: state.position,
      start_date: state.start_date,
      task_category: state.task_category,
      time_taken: state.time_taken,
      task_type: state.task_type
    }

    fetch(url, httpPutOptions({ task }))
      .then(response => response.json())
      .then(data => {
        let error_container = document.getElementById('error-container')
        if (data && data.data && data.data.id != null) {
          error_container.style.display = 'none'
          toast('Saved', 'success')
          TaskStore.loadTasks(state.batch_id)
        } else {
          console.log(data.errors)
        }
      })
  }

  async updateTask(batch_id, task) {
    this.isLoading = true
    let new_task = task
    let id = task.id
    let end_date = task['_end']
    let start_date = task['_start']

    let timeDiff = new Date(end_date).getTime() - new Date(start_date).getTime()
    let duration = timeDiff / (1000 * 3600 * 24)

    const found = toJS(this.tasks.find(x => x.id === task.id))
    if (found) {
      let url = `/api/v1/batches/${batch_id}/tasks/${id}`
      let payload = {
        assigned_employee: found.assigned_employee,
        batch_id: found.batch_id,
        days_from_start_date: found.days_from_start_date,
        depend_on: found.depend_on,
        duration: duration,
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

      try {
        const response = await (await fetch(
          url,
          httpPutOptions(payload)
        )).json()
        await this.loadTasks(batch_id)
        this.isLoading = false
        toast('Task Updated', 'success')
      } catch (error) {
        console.log(error)
      }
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
