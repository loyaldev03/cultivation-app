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
import { addDays, differenceInCalendarDays, parse } from 'date-fns'

function parseTask(taskAttributes) {
  const { start_date, duration } = taskAttributes
  const startDate = parse(start_date)
  const endDate = addDays(startDate, duration)
  return Object.assign(taskAttributes, {
    start_date: startDate,
    duration: duration,
    end_date: endDate
  })
}

function haveChildren(nodeWbs, tasks) {
  const childWbs = nodeWbs + '.'
  return tasks.some(t => t.wbs.startsWith(childWbs))
}

function updateFlags(tasks) {
  tasks.forEach(task => {
    task.haveChildren = haveChildren(task.wbs, tasks)
  })
  return tasks
}

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
      const tasks = response.data.map(res => parseTask(res.attributes))
      this.tasks = updateFlags(tasks)
      this.isDataLoaded = true
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
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
  async deleteTask(batchId, taskId) {
    this.isLoading = true
    // Optimistic update
    this.tasks = this.tasks.filter(t => t.id !== taskId)
    const url = `/api/v1/batches/${batchId}/tasks/${taskId}`
    try {
      const response = await (await fetch(url, httpDeleteOptions())).json()
      if (response.errors && response.errors.id) {
        toast(data.errors.id, 'error')
      } else {
        toast('Task deleted', 'success')
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

  getTaskByWbs(wbs) {
    return toJS(this.tasks.find(x => x.wbs && x.wbs === wbs))
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
  async editTask(batchId, taskId, updateObj, isReload = false) {
    this.isLoading = true
    const task = this.getTaskById(taskId)
    const payload = Object.assign({}, task, updateObj)
    // Optimistic update
    this.tasks = this.tasks.map(t => {
      return t.id === taskId ? payload : t
    })
    const url = `/api/v1/batches/${batchId}/tasks/${taskId}`
    try {
      const response = await (await fetch(url, httpPutOptions(payload))).json()
      // Replace optimistic update with actual response
      if (response.data) {
        toast('Task saved', 'success')
        if (isReload) {
          this.loadTasks(batchId)
        } else {
          const updated = parseTask(response.data.attributes)
          this.tasks = this.tasks.map(t => {
            return t.id === taskId ? updated : t
          })
        }
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.log(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async editStartDate(batchId, taskId, startDate) {
    const task = this.getTaskById(taskId)
    if (startDate && task.end_date) {
      const endDate = addDays(startDate, task.duration)
      const updateObj = {
        start_date: startDate,
        end_date: endDate,
        duration: task.duration
      }
      await this.editTask(batchId, taskId, updateObj, true)
    }
  }

  @action
  async editEndDate(batchId, taskId, endDate) {
    const task = this.getTaskById(taskId)
    if (endDate && task.start_date) {
      let startDate = parse(task.start_date)
      if (endDate <= startDate) {
        // This would push the start date back by duration
        startDate = addDays(endDate, task.duration * -1)
        const updateObj = {
          start_date: startDate,
          end_date: endDate,
          duration: task.duration
        }
        await this.editTask(batchId, taskId, updateObj, true)
      } else {
        const duration = differenceInCalendarDays(endDate, startDate)
        const updateObj = {
          start_date: startDate,
          end_date: endDate,
          duration: duration
        }
        await this.editTask(batchId, taskId, updateObj, true)
      }
    }
  }

  @action
  async editDuration(batchId, taskId, duration) {
    const task = this.getTaskById(taskId)
    if (duration && task.start_date) {
      const startDate = parse(task.start_date)
      const endDate = addDays(startDate, duration)
      const updateObj = {
        start_date: startDate,
        end_date: endDate,
        duration
      }
      await this.editTask(batchId, taskId, updateObj, true)
    }
  }

  @action
  async editEstimatedHours(batchId, taskId, estimatedHours = 0) {
    const task = this.getTaskById(taskId)
    if (estimatedHours) {
      const updateObj = {
        estimated_hours: estimatedHours
      }
      await this.editTask(batchId, taskId, updateObj, true)
    }
  }

  @action
  async editAssignedUsers(batchId, taskId, user_ids = []) {
    const task = this.getTaskById(taskId)
    const updateObj = {
      user_ids
    }
    await this.editTask(batchId, taskId, updateObj, true)
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

  @action
  async deleteRelationship(batch_id, destination_id) {
    this.isLoading = true

    const url = `/api/v1/batches/${batch_id}/tasks/${destination_id}/delete_relationship`
    const payload = { destination_id }
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      await this.loadTasks(batch_id)
      this.isLoading = false
      toast('Task Relationship Deleted', 'success')
    } catch (error) {
      console.log(error)
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
