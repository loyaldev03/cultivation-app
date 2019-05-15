import { observable, action, computed, toJS } from 'mobx'
import { httpGetOptions, formatDate, formatTime } from '../../utils'
import isEmpty from 'lodash.isempty'

const uniq = require('lodash.uniq')

function parseIssue(taskAttributes) {
  const { created_at } = taskAttributes
  const new_created_at = `${formatDate(created_at)}, ${formatTime(created_at)}`
  return Object.assign(taskAttributes, {
    created_at: new_created_at
  })
}

class IssueStore {
  issues = observable([])
  @observable isLoading = false
  @observable filter = ''
  @observable columnFilters = {}

  @action
  load(newIssues) {
    this.issues.replace(newIssues)
  }

  @action
  async loadAllIssues() {
    this.isLoading = true
    const url = `/api/v1/issues/all`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        const issues = response.data.map(res => {
          let temp = res
          temp.attributes = parseIssue(res.attributes)
          return temp
        })
        this.load(issues)
        this.isLoading = false
      } else {
        this.tasks = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
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
    return this.issues.filter(
      x => x.attributes.status !== 'resolved' && !x.attributes.is_archived
    ).length
  }

  @computed
  get filteredList() {
    const list = this.issues.map(x => x.attributes)
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return list.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const field1 = b.issue_no.toString()
        const field2 = b.description.toLowerCase()
        const filter = this.filter.toLowerCase()
        return field1.includes(filter) || field2.includes(filter)
      })
    } else {
      return list
    }
  }

  @computed
  get openIssuesCount() {
    return this.issues.map(x => x.attributes.status === 'open').length || 0
  }

  isFiltered = record => {
    let f = Object.keys(this.columnFilters).find(key => {
      const filter = this.columnFilters[key].filter(x => x.value === false)
      return filter.find(x => x.label === record[key])
    })
    return f ? true : false
  }

  updateFilterOptions = (propName, filterOptions) => {
    console.log('updating')
    const updated = {
      ...this.columnFilters,
      [propName]: filterOptions
    }
    this.columnFilters = updated
  }

  getUniqPropValues = propName => {
    return uniq(this.filteredList.map(x => x[propName]).sort())
  }
}

const issueStore = new IssueStore()
export default issueStore
