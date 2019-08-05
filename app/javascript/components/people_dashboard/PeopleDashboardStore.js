import isEmpty from 'lodash.isempty'
import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions
} from '../utils'

function parseTask(taskAttributes) {
  return Object.assign(taskAttributes)
}

const coloR = []

const dynamicColors = function() {
  let r = Math.floor(Math.random() * 255)
  let g = Math.floor(Math.random() * 255)
  let b = Math.floor(Math.random() * 255)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

class PeopleDashboardStore {
  @observable data_worker_salary = []
  @observable worker_salary_loaded = false
  @observable data_headcount = []
  @observable headcount_loaded = false
  @observable data_attrition = []
  @observable attrition_loaded = false
  @observable data_roles = []
  @observable roles_loaded = false
  //@observable isLoading = false

  @action
  async loadWorkerSalary(facility_id) {
    this.isLoading = true
    this.worker_salary_loaded = false
    const url = `/api/v1/people/employee_salary_chart?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_worker_salary = response
        this.worker_salary_loaded = true
      } else {
        this.data_worker_salary = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @computed get workerSalary() {
    if (this.worker_salary_loaded) {
      for (var i in this.data_worker_salary) {
        coloR.push(dynamicColors())
      }
      let final_result = {
        labels: this.data_worker_salary.map(e => e.group_title),
        datasets: [
          {
            data: this.data_worker_salary.map(e => e.value),
            backgroundColor: this.data_worker_salary.map(e => e.color),
            hoverBackgroundColor: this.data_worker_salary.map(e => e.color)
          }
        ]
      }

      return final_result
    } else {
      return {}
    }
  }

  @action
  async loadheadCount(facility_id) {
    this.isLoading = true
    this.headcount_loaded = false
    const url = `/api/v1/people/head_counts_chart?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_headcount = response
        this.headcount_loaded = true
      } else {
        this.data_headcount = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @computed get headCount() {
    if (this.headcount_loaded) {
      for (var i in this.data_headcount) {
        coloR.push(dynamicColors())
      }
      let final_result = {
        labels: this.data_headcount.map(e => e.title),
        datasets: [
          {
            data: this.data_headcount.map(e => e.value),
            backgroundColor: this.data_headcount.map(e => e.color),
            hoverBackgroundColor: this.data_headcount.map(e => e.color)
          }
        ]
      }

      return final_result
    } else {
      return {}
    }
  }

  @action
  async loadAttrition(facility_id, role, period) {
    this.isLoading = true
    this.attrition_loaded = false
    const url = `/api/v1/people/worker_attrition?facility_id=${facility_id}&&role=${role}&&period=${period}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_attrition = response
        this.attrition_loaded = true
      } else {
        this.data_attrition = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @computed get attritionCount() {
    if (this.attrition_loaded) {
      let final_result = {
        labels: this.data_attrition.map(d => d.month),
        datasets: [
          {
            label: 'New Employee',
            data: this.data_attrition.map(d => d.new_employee_count),
            backgroundColor: 'green'
          },
          {
            label: 'Leaving Employee',
            data: this.data_attrition.map(
              d => -Math.abs(d.leaving_employee_count)
            ),
            backgroundColor: 'red'
          }
        ]
      }
      return final_result
    } else {
      return {}
    }
  }

  @action
  async loadRoles() {
    this.isLoading = true
    this.roles_loaded = false
    const url = `/api/v1/people/get_roles`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_roles = response
        this.roles_loaded = true
      } else {
        this.data_roles = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

}

const peopleStore = new PeopleDashboardStore()

export default peopleStore
