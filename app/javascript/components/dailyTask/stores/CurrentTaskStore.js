import { observable, action, computed, toJS } from 'mobx'

class CurrentTaskStore {
  @observable taskId = null
  issues = observable([])
  notes = observable([])
  materialsUsed = observable([])

  loadIssues(issues) {
    this.issues.replace(issues)
  }

  loadNotes(notes) {
    this.notes.replace(notes)
  }

  loadMaterialsUsed(materialsUsed) {
    this.materialsUsed.replace(materialsUsed)
  }

  @computed
  bindableIssues() {
    return this.issues.slice()
  }

  @computed
  bindableNotes() {
    return this.notes.slice()
  }

  @computed
  bindableMaterialsUsed() {
    return this.materialsUsed.slice()
  }
}

const currentTasksStore = new CurrentTaskStore()
export default currentTasksStore