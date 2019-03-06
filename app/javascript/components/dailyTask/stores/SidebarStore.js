import { observable, action, computed, toJS } from 'mobx'

class SidebarStore {
  showNotes = observable.box(false)
  @observable showMaterialUsed = false
  @observable showIssues = false

  @observable batchId = null
  @observable taskId = null
  @observable noteId = null
  @observable noteBody = ''

  @action
  openNotes(batchId, taskId, noteId = null, noteBody = '') {
    this.showNotes.set(true)
    this.showMaterialUsed = false
    this.showIssues = false
    this.batchId = batchId
    this.taskId = taskId
    this.noteId = noteId
    this.noteBody = noteBody
  }

  @action
  closeNotes() {
    this.showNotes.set(false)
    this.showMaterialUsed = false
    this.showIssues = false
    this.noteId = null
    this.noteBody = ''
    this.batchId = null
    this.taskId = null
  }

  // @action
  // toggleNotes(batchId = null, taskId = null, noteId = null) {
  //   this.showNotes = batchId != null && taskId != null
    
  //   this.showMaterialUsed = false
  //   this.showIssues = false

  //   if (!this.showNotes) {
  //     this.noteId = ''
  //   }

  //   console.log(toJS(this.showNotes), toJS(this.taskId))
  // }

  @action
  toggleMaterialUsed(batchId = null, taskId = null) {
    this.showNotes = false
    this.showIssues = false
    this.batchId = batchId
    this.taskId = taskId
    this.showMaterialUsed = batchId != null && taskId != null
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
