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

  @action
  openNotes(batchId, taskId, noteId = null, noteBody = '') {
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
    this.noteId = null
    this.noteBody = ''
    this.batchId = null
    this.taskId = null

    this.showNotes.set(false)
    this.showMaterialUsed.set(false)
    this.showIssues.set(false)
  }

  @action
  openMaterialUsed(batchId = null, taskId = null) {
    this.showNotes = false
    this.showIssues = false
    this.showMaterialUsed = true
    this.batchId = batchId
    this.taskId = taskId
  }

  @action
  closeMaterialUsed() {
    this.showNotes = false
    this.showIssues = false
    this.showMaterialUsed = false
    this.batchId = null
    this.taskId = null
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
