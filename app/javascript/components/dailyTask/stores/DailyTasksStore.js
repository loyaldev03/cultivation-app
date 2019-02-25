import { observable, action, computed, toJS } from 'mobx'
import { httpPutOptions } from '../../utils'
class DailyTaskStore {
  batches = observable([])

  load(batches) {
    this.batches.replace(batches)
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

  @action
  async updateTimeLog(action, taskId) {
    this.isLoading = true
    const url = `/api/v1/daily_tasks/time_log`
    try {
      const payload = { actions: action, task_id: taskId }
      const response = await (await fetch(url, httpPutOptions(payload))).json()
      if (response.data) {
        // this.loadTasks(batchId)
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.error(error)
    } finally {
      // this.isLoading = false
    }
  }
}

const dailyTasksStore = new DailyTaskStore()
export default dailyTasksStore
