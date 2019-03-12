import { observable, action, computed, toJS } from 'mobx'

class SidebarStore {
  // Controls which sidebar is visible
  showNotes = observable.box(false)
  showMaterialUsed = observable.box(false)
  showIssues = observable.box(false)

  @observable facilityId = null
  @observable batchId = null
  @observable taskId = null
  @observable noteId = null
  @observable noteBody = ''
  @observable issueId = ''
  @observable issueMode = ''
  @observable dailyTask = null
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
    this.showMaterialUsed.set(true)
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

  @action
  openIssues(id = null, mode = null, dailyTask = null) {
    this.reset()
    this.issueId = id
    this.issueMode = mode
    this.dailyTask = dailyTask
    this.showIssues.set(true)
  }

  closeIssues() {
    this.reset()
  }
}

const sidebar = new SidebarStore()
export default sidebar
