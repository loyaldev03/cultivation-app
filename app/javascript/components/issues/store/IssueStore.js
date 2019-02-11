import { observable, action, computed } from 'mobx'

class IssueStore {
  issues = observable([])
  @observable isLoading = false

  @action
  load(newIssues) {
    this.issues.replace(newIssues)
  }

  @action
  prepend(newIssue) {
    this.issues.replace([newIssue, ...this.issues.slice()])
  }

  @action
  update(issue) {
    const index = this.issues.findIndex(x => x.id === issue.id)
    if (index >= 0) {
      this.issues[index] = issue
    }
  }

  @action
  delete(issue) {
    this.issues.replace(this.issues.filter(x => x.id !== issue.id))
  }

  @computed
  get bindable() {
    return this.issues.slice()
  }
}

const issueStore = new IssueStore()
export default issueStore
