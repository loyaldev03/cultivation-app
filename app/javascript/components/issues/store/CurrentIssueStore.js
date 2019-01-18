import { observable, action, computed, set } from 'mobx'

class CurrentIssueStore {
  @observable issue = this.resetState()

  resetState = () => {
    return {
      id: '',
      issue_no: '',
      title: '',
      description: '',
      severity: '',
      status: '',
      issue_type: '',
      location_id: '',
      location_type: '',
      created_at: null,
      attachments: [], // not sure if this is ok
      comments: [],
      task: { id: '', name: '' },
      reported_by: {
        id: '',
        first_name: '',
        last_name: '',
        photo: ''
      },
      assigned_to: {
        id: '',
        first_name: '',
        last_name: '',
        photo: ''
      }
    }
  }

  @action
  load(issue) {
    console.group('load issue')
    console.log(issue)
    console.groupEnd()
    set(this.issue, issue)
  }

  // @computed
  // isAssigned() {
  //   return this.issue.assigned_to.id.length > 0
  // }

  @action
  reset() {
    set(this.issue, this.resetState())
  }
}

const currentIssue = new CurrentIssueStore()
export default currentIssue
