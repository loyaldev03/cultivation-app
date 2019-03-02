import { observable, action, computed, toJS } from 'mobx'
import { httpPutOptions, httpDeleteOptions } from '../../utils'

class DailyTaskStore {
  @observable batches = []
  @observable isLoading = false
  
  @action
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
      this.isLoading = false
    }
  }
}

const dailyTasksStore = new DailyTaskStore()
export default dailyTasksStore
