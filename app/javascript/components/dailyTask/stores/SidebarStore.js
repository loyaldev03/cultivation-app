import { observable, action, computed, toJS } from 'mobx'

class SidebarStore {
  // Controls which sidebar is visible
  showNotes = observable.box(false)
  showMaterialUsed = observable.box(false)
  showIssues = observable.box(false)

  @observable batchId = null
  @observable taskId = null
  @observable noteId = null
  @observable noteBody = ''

  reset() {
    this.noteId = null
    this.noteBody = ''
    this.batchId = null
    this.taskId = null
    this.showNotes.set(false)
    this.showMaterialUsed.set(false)
    this.showIssues.set(false)
  }

  @action
  openNotes(batchId, taskId, noteId = null, noteBody = '') {
    this.reset()
    // The order of the call here matters, do not change!
    this.batchId = batchId
    this.taskId = taskId
    this.noteId = noteId
    this.noteBody = noteBody

    this.showNotes.set(true)
    this.showMaterialUsed.set(false)
    this.showIssues.set(false)
  }

  @action
  closeNotes() {
    this.reset()
  }

  @action
  openMaterialUsed(batchId = null, taskId = null) {
    this.reset()
    this.noteId = null
    this.noteBody = ''
    this.batchId = batchId
    this.taskId = taskId

    this.showNotes.set(false)
    this.showMaterialUsed.set(true)
    this.showIssues.set(false)
  }

  @action
  closeMaterialUsed() {
    this.reset()
  }

  @action
  toggleIssues(batchId = null, taskId = null) {
    this.showNotes = false
    this.showMaterialUsed = false
    this.showIssues = !this.showIssues
  }
}

const sidebar = new SidebarStore()
export default sidebar
