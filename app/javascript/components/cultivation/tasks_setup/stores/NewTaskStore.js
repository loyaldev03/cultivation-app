import { observable, action, toJS, computed } from 'mobx'
import {
  httpPutOptions,
  httpGetOptions,
  httpPostOptions,
  httpDeleteOptions,
  sumBy,
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

function getChildren(wbs, tasks = []) {
  const childWbs = wbs + '.'
  return tasks.filter(t => t.wbs.startsWith(childWbs))
}

function cascadeIndelible(task, tasks) {
  if (task.is_parent && task.indelible === 'add_nutrient') {
    const children = getChildren(task.wbs, tasks)
    children.forEach(x => {
      x.indelible = task.indelible
      if (x.is_parent) {
        cascadeIndelible(x, tasks)
      }
    })
  }
}

function updateFlags(singleTarget, tasks) {
  if (singleTarget && tasks) {
    cascadeIndelible(singleTarget, tasks)
    return singleTarget
  }
  if (tasks) {
    tasks.forEach(task => {
      cascadeIndelible(task, tasks)
    })
    return tasks
  } else {
    return []
  }
}

class TaskStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable collapsedNodes = []
  @observable tasks = []
  @observable isSunburstNodeSelected = false
  @observable facilityPhases = []

  @action
  updateSunburstIsSelected() {
    this.isSunburstNodeSelected = true
  }

  @action
  async loadTasks(batchId) {
    this.isLoading = true
    const url = `/api/v1/batches/${batchId}/tasks`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        const tasks = response.data.map(res => parseTask(res.attributes))
        this.tasks = updateFlags(null, tasks)
        this.isDataLoaded = true
      } else {
        this.tasks = []
        this.isDataLoaded = false
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
      this.loadIssues(batchId)
    }
  }

  @action
  async loadIssues(batchId) {
    const url = `/api/v1/batches/${batchId}/tasks/load_issues`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.tasks = this.tasks.map(s => {
          let a = response.data.find(e => e.task_id === s.id)
          if (a) {
            s.issues = a.issues
          }
          return s
        })
      }
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
        this.loadTasks(batchId)
      } else {
        toast(response.errors.error[0], 'success')
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

  @computed get batchStartDate() {
    if (this.isDataLoaded) {
      return this.tasks[0].start_date
    } else {
      return new Date()
    }
  }

  @computed get childTasks() {
    if (this.isDataLoaded) {
      return this.tasks.filter(t => !t.is_parent)
    } else {
      return []
    }
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

  @computed get phaseDuration() {
    if (this.isDataLoaded) {
      // Build phase schedule from current Task List
      const stayingTasks = this.tasks.filter(
        t =>
          t.indelible === 'staying' &&
          this.facilityPhases.some(p => p === t.phase)
      )
      const phaseDuration = {}
      stayingTasks.forEach(t => {
        phaseDuration[t.phase] = t.duration
      })
      return phaseDuration
    } else {
      return {}
    }
  }

  @computed get totalDuration() {
    const durations = this.phaseDuration
    let total = 0
    Object.keys(durations).forEach(key => {
      total += durations[key]
    })
    return total
  }

  @computed get totalEstimatedHours() {
    if (this.isDataLoaded) {
      const value = sumBy(this.childTasks, 'estimated_hours')
      return value
    } else {
      return '--'
    }
  }

  @computed get totalEstimatedCost() {
    if (this.isDataLoaded) {
      const value = sumBy(this.childTasks, 'estimated_cost')
      return value
    } else {
      return '--'
    }
  }

  getTaskById(id) {
    return toJS(this.tasks.find(x => x.id === id))
  }

  getTaskByWbs(wbs) {
    return toJS(this.tasks.find(x => x.wbs && x.wbs === wbs))
  }

  getChildren(nodeWbs) {
    getChildren(nodeWbs, this.tasks)
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
    return this.formatGantt(this.taskList)
  }

  @action
  async createTask(batchId, relatedTaskId, taskAction, updateObj) {
    this.isLoading = true
    const task = Object.assign(
      {},
      {
        batch_id: batchId,
        action: taskAction,
        name: updateObj.name,
        start_date: updateObj.start_date,
        end_date: updateObj.end_date,
        duration: updateObj.duration,
        estimated_hours: updateObj.estimated_hours,
        task_related_id: relatedTaskId // Reference to the position of new task
      }
    )
    const url = `/api/v1/batches/${batchId}/tasks`
    try {
      const response = await (await fetch(
        url,
        httpPostOptions({ task })
      )).json()
      if (response.data) {
        toast('Task added', 'success')
        await this.loadTasks(batchId)
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
  async createNoBatchTask(params) {
    this.isLoading = true
    const task = params
    const url = `/api/v1/tasks/create_no_batch`
    try {
      const response = await (await fetch(
        url,
        httpPostOptions({ task })
      )).json()
      if (response) {
        console.log(response)
        toast('Task added', 'success')
        // await this.loadTasks(batchId)
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
          const parsed = parseTask(response.data.attributes)
          const updated = updateFlags(parsed, this.tasks)
          this.tasks = this.tasks.map(t => {
            return t.id === taskId ? updated : t
          })
        }
      } else if (response.errors) {
        console.error(response.errors)
        toast(response.errors.error[0], 'error')
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
      user_ids,
      action: 'edit_assignees'
    }
    await this.editTask(batchId, taskId, updateObj, true)
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
    if (this.isDataLoaded) {
      let formatted_tasks = tasks.map(task => {
        const { id, name, start_date, end_date } = task
        const end = addDays(end_date, -1)
        return {
          id,
          name,
          start: start_date,
          end: end,
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

  @action
  async roomData(id, roomPurpose) {
    const url = `/api/v1/batches/search_locations?facility_id=${id}&purpose[]=${roomPurpose}`
    const response = await (await fetch(url, httpGetOptions)).json()
    return response.data || []
  }

  @action
  async getPlantOnSelect(facility_id, strain_id, location_id) {
    if (facility_id && strain_id && location_id) {
      const url = `/api/v1/plants/search_by_location?facility_id=${facility_id}&strain_id=${strain_id}&location_id=${location_id}`
      const response = await (await fetch(url, httpGetOptions)).json()
      return response || []
    } else {
      return []
    }
  }

  @action
  async editAssignedMaterial(
    batchId,
    taskId,
    items = [],
    nutrients = [],
    water_ph
  ) {
    const task = this.getTaskById(taskId)
    const url = `/api/v1/batches/${batchId}/tasks/${taskId}/update_material_use`
    console.log(nutrients)
    const payload = {
      items: items.map(e => ({
        product_id: e.product_id,
        quantity: e.quantity,
        uom: e.uom
      })),
      nutrients: nutrients
        .filter(x => x.value)
        .map(x => {
          return {
            element: x.element,
            value: x.value
          }
        }),
      water_ph
    }
    console.log(payload)
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      console.log(response)
      task.items = response.data.attributes.items
      task.add_nutrients = response.data.attributes.add_nutrients
      this.tasks = this.tasks.map(t => {
        return t.id === taskId ? task : t
      })
      toast('Material updated', 'success')
    } catch (error) {
      console.log(error)
    }
  }

  @action
  async saveAsTemplate(batch_id) {
    this.isLoading = true

    const url = `/api/v1/batches/${batch_id}/save_as_template`
    const payload = {}
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      // console.log(response)
      location.reload()
      this.isLoading = false
      toast('Batch saved as template', 'success')
    } catch (error) {
      console.log(error)
    }
  }
}

const taskStore = new TaskStore()

export default taskStore
