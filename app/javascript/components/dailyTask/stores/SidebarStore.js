import { observable, action, computed, toJS } from 'mobx'

class SidebarStore {
  @observable showNotes = false
  @observable showMaterialUsed = false
  @observable showIssues = false

  @observable batchId = null
  @observable taskId = null

  @action
  toggleNotes(batchId = null, taskId = null) {
    this.showNotes = !this.showNotes
    this.showMaterialUsed = false
    this.showIssues = false
  }

  @action
  toggleMaterialUsed(batchId = null, taskId = null) {
    this.showNotes = false
    this.showIssues = false
    this.batchId = batchId
    this.taskId = taskId
    this.showMaterialUsed = batchId != null && taskId != null
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
