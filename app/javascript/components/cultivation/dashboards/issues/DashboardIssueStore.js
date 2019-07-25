import isEmpty from 'lodash.isempty'
import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions
} from '../../../utils'

function parseTask(taskAttributes) {
  return Object.assign(taskAttributes)
}

class IssueDashboard {
  @observable data_issue_by_priority = []
  @observable data_issue_by_group = []
  @observable issue_by_priority_loaded = false
  @observable issue_by_group_loaded = false

  @action
  async loadIssueByPriority(facility_id) {
    this.isLoading = true
    this.issue_by_priority_loaded = false
    const url = `/api/v1/dashboard_charts/issue_by_priority?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        console.log(response)
        this.data_issue_by_priority = response
        this.issue_by_priority_loaded = true
      } else {
        this.data_issue_by_priority = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadIssueByGroup(facility_id) {
    this.isLoading = true
    this.issue_by_group_loaded = false
    const url = `/api/v1/dashboard_charts/issue_by_group?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_issue_by_group = response
        this.issue_by_group_loaded = true
      } else {
        this.data_issue_by_group = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @computed get IssueByGroup() {
    if (this.issue_by_group_loaded) {
      let final_result = {
        labels: this.data_issue_by_group[0].issues.map(d => d.date),
        datasets: this.data_issue_by_group.map(e => {
          let rgb =
            'rgb(' +
            Math.floor(Math.random() * 255) +
            ',' +
            Math.floor(Math.random() * 255) +
            ',' +
            Math.floor(Math.random() * 255) +
            ')'
          return {
            label: e.issue_type,
            data: e.issues.map(f => f.issue_count),
            backgroundColor: rgb,
            fill: false,
            lineTension: 0.1,
            borderColor: rgb,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: rgb,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: rgb,
            pointHoverBorderColor: rgb,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10
          }
        })
      }

      return final_result
    } else {
      return {}
    }
  }

  @computed get IssueByPriority() {
    if (this.issue_by_priority_loaded) {
      let final_result = {
        labels: this.data_issue_by_priority.map(d => d.priority),
        datasets: [
          {
            label: 'Count',
            data: this.data_issue_by_priority.map(d => d.count),
            backgroundColor: 'rgba(241, 90, 34, 1)'
          }
        ]
      }

      return final_result
    } else {
      return {}
    }
  }
}

const issueDashboard = new IssueDashboard()

export default issueDashboard
