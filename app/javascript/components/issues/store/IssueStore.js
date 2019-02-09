import { observable, action, computed, toJS } from 'mobx'

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

  @computed
  get unresolvedCount() {
    return this.issues.filter(x => (x.attributes.status !== 'resolved' && !x.attributes.is_archived)).length
  }
}

const issueStore = new IssueStore()
export default issueStore
