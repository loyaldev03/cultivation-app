import { observable, action, computed, toJS } from 'mobx'

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

  @action
  deleteNote(taskId, noteId) {
    this.batches.forEach(b => {
      const task = b.tasks.find(x => x.id === taskId)
      if (task) {
        if (task.notes) {
          task.notes = task.notes.filter(n => n.id !== noteId)
        }
      }
    })
  }

  @computed
  get bindable() {
    return this.batches.slice()
  }
}

const dailyTasksStore = new DailyTaskStore()
export default dailyTasksStore
