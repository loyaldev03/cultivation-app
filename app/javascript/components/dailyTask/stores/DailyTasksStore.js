import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions,
  httpGetOptions
} from '../../utils'
import taskStore from '../../cultivation/tasks_setup/stores/NewTaskStore'
import isEmpty from 'lodash.isempty'

class DailyTaskStore {
  @observable batches = []
  @observable locations = []
  @observable isLoading = false
  @observable loaded_tasks = false
  @observable has_tasks = true
  @observable otherTasks = {}
  @observable isShowAllTasks = false

  @action
  load(batches) {
    //console.log(batches)
    if (!isEmpty(batches)) {
      this.has_tasks = true
      this.batches.replace(batches)
    } else {
      this.has_tasks = false
      //console.log(this.has_tasks)
    }
  }

  @action
  load_tasks(response) {
    //console.log(response)
    if (response.status == 200) {
      this.loaded_tasks = true
      if (isEmpty(response.data)) {
        //console.log('MASUKKK')
        this.has_tasks = false
      }
    }
  }

  @action
  loadOtherTasks(otherTasks) {
    // this.otherTasks.replace(otherTasks)
    // this.batches.replace(otherTasks)
    set(this.otherTasks, otherTasks)
    // this.batches.replace([...this.batches, otherTasks])
  }

  @action
  toggleShowAllTasks() {
    this.isShowAllTasks = !this.isShowAllTasks
  }

  @action
  async appendMaterialUse(batchId, taskId, items) {
    const url = `/api/v1/batches/${batchId}/tasks/${taskId}/append_material_use`
    const payload = { items }

    const response = await (await fetch(url, httpPostOptions(payload))).json()
    if (!response.error) {
      if (batchId === 'others') {
        // other tasks
        const task = this.otherTasks.tasks.find(x => x.id === taskId)
        task.items = response.data.attributes.items
      } else {
        const batch = this.batches.find(x => x.id === batchId)
        const task = batch.tasks.find(x => x.id === taskId)
        task.items = response.data.attributes.items
      }
    }
    return response
  }

  @action
  updateNote(note) {
    this.batches.forEach(b => {
      const task = b.tasks.find(x => x.id === note.task_id)
      if (task) {
        if (task.notes) {
          const exist = task.notes.find(n => n.id === note.id)
          if (exist) {
            task.notes = task.notes.map(n => (n.id === note.id ? note : n))
          } else {
            task.notes = [...task.notes, note]
          }
        } else {
          task.notes = [note]
        }
      }
    })
  }

  @computed
  get bindable() {
    return this.batches.slice()
  }

  getNutrientsByTask(batchId, taskId) {
    const batch = this.batches.find(x => x.id === batchId)
    const task = batch.tasks.find(x => x.id === taskId)
    return task.nutrients
  }

  @action
  async editNote(taskId, noteId, body) {
    this.isLoading = true
    const url = `/api/v1/daily_tasks/${taskId}/update_note`
    const payload = { note_id: noteId, body }
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        this.updateNote(response.data)
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
  async updateTimeLog(action, taskId, batchId) {
    this.isLoading = true
    const url = `/api/v1/daily_tasks/time_log`
    const payload = { actions: action, task_id: taskId }
    try {
      const response = await (await fetch(url, httpPutOptions(payload))).json()
      if (response.data) {
        // this.loadTasks(batchId)
        this.updateTaskWorkStatus(batchId, taskId, action)
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
  async updateNutrients(batchId, taskId, nutrients) {
    this.isLoading = true
    const url = `/api/v1/daily_tasks/${taskId}/update_nutrients`
    const payload = { nutrients }
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        //enable done button if all task is completed
        let nutrients = this.getNutrientsByTask(batchId, taskId)
        let checkedNutrients = nutrients.filter(e => e.checked === true)
        let taskCompleted = nutrients.length === checkedNutrients.length
        this.updateTaskWorkIndelibleDone(batchId, taskId, taskCompleted)
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
  async deleteNote(taskId, noteId) {
    this.isLoading = true
    const url = `/api/v1/daily_tasks/${taskId}/notes/${noteId}`
    try {
      const response = await (await fetch(url, httpDeleteOptions())).json()
      if (response.data) {
        this.batches.forEach(b => {
          const task = b.tasks.find(x => x.id === taskId)
          if (task) {
            if (task.notes) {
              task.notes = task.notes.filter(n => n.id !== noteId)
            }
          }
        })
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
  updateOrAppendIssue(batchId, issue) {
    let task = null
    if (batchId === 'others') {
      task = this.otherTasks.tasks.find(x => x.id === issue.task.id)
    } else {
      const batch = this.batches.find(x => x.id === batchId)
      task = batch.tasks.find(x => x.id === issue.task.id)
    }

    const toInsert = {
      id: issue.id,
      issue_no: issue.issue_no,
      title: issue.title,
      severity: issue.severity,
      status: issue.status,
      created_at: issue.created_at,
      tags: issue.tags
    }

    const exist = task.issues.find(i => i.id === toInsert.id)
    if (exist) {
      task.issues = task.issues.map(i => (i.id === toInsert.id ? toInsert : i))
    } else {
      task.issues = [...task.issues, toInsert]
    }

    // For now seems like this is the only way to force rerender
    // this.batches.replace(toJS(this.batches))
  }

  @action
  updateTaskWorkStatus(batchId, taskId, status) {
    // For other tasks where batchId is others
    if (batchId === 'others') {
      let task = this.otherTasks.tasks.find(x => x.id === taskId)
      task.work_status = status
    } else {
      // for task that have batchId
      if (batchId.length > 0) {
        let batch = this.batches.find(x => x.id === batchId)
        let task = batch.tasks.find(x => x.id === taskId)
        task.work_status = status
        this.batches = this.batches.map(t => {
          return t.id === batchId ? batch : t
        })
      }
    }
  }

  @action
  updateTaskWorkIndelibleDone(batchId, taskId, indelible_done) {
    let batch = this.batches.find(x => x.id === batchId)
    let task = batch.tasks.find(x => x.id === taskId)
    task.indelible_done = indelible_done
    this.batches = this.batches.map(t => {
      return t.id === batchId ? batch : t
    })
  }

  @action
  async loadLocation(facilityId, purposes) {
    let url = `/api/v1/facilities/${facilityId}/locations?`
    if (!isEmpty(purposes)) {
      if (purposes.includes(',')) {
        url =
          url +
          purposes
            .split(',')
            .map(p => 'purposes[]=' + p)
            .join('&')
      } else {
        url = url + 'purposes[]=' + purposes
      }
    }
    const res = await (await fetch(url, httpGetOptions)).json()
    if (res.data) {
      this.locations = res.data
    } else {
      this.locations = []
    }
  }

  @action
  async autoSaveReceiveCannabis(payload) {
    let url = `/api/v1/manifests`
    const response = await (await fetch(url, httpPostOptions(payload))).json()
    if (!response.error) {
    }
    return response
  }

  @action
  async findManifestNo(manifest_no) {
    let url = `/api/v1/manifests/show?manifest_no=${manifest_no}`
    const response = await (await fetch(url, httpGetOptions)).json()
    if (response) {
      return response
    } else {
      this.locations = []
    }
  }
}

const dailyTasksStore = new DailyTaskStore()
export default dailyTasksStore
