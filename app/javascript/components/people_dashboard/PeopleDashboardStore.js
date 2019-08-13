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
  @observable data_reminder = []
  @observable reminder_loaded = false
  @observable overall_info = {}
  @observable overall_info_loaded = false
  @observable data_capacity_planning = []
  @observable capacity_planning_loaded = false
  @observable data_worker_lists = []
  @observable current_workers_length = 0
  @observable ontime_arrival_loaded = false
  @observable data_ontime_arrival = []
  //@observable isLoading = false

  @action
  async loadCapacityPlanning(facility_id, period) {
    this.isLoading = true
    this.capacity_planning_loaded = false
    this.current_workers_length = 0
    const url = `/api/v1/people/capacity_planning?facility_id=${facility_id}&period=${period}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_capacity_planning = response
        this.capacity_planning_loaded = true
      } else {
        this.data_capacity_planning = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  setWorkerList(job_title) {
    this.data_worker_lists = this.data_capacity_planning.find(
      e => e.title == job_title
    )
    this.current_workers_length = this.data_worker_lists.users.length
  }

  @action
  async loadReminder(facility_id) {
    this.isLoading = true
    this.reminder_loaded = false
    const url = `/api/v1/people/reminder?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_reminder = response
        this.reminder_loaded = true
      } else {
        this.data_reminder = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadWorkerSalary(facility_id, period) {
    this.isLoading = true
    this.worker_salary_loaded = false
    const url = `/api/v1/people/employee_salary_chart?facility_id=${facility_id}&&period=${period}`
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
        labels: this.data_worker_salary.map(e => e.title),
        datasets: [
          {
            data: this.data_worker_salary.map(e => e.actual_labor_costs),
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
  async loadheadCount(facility_id, period) {
    this.isLoading = true
    this.headcount_loaded = false
    const url = `/api/v1/people/head_counts_chart?facility_id=${facility_id}&&period=${period}`
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
            data: this.data_headcount.map(e => e.user_count),
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

  @action
  async loadOverallInfo(facility_id, period) {
    this.isLoading = true
    this.roles_loaded = false
    const url = `/api/v1/people/overall_info?facility_id=${facility_id}&&period=${period}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.overall_info = response
        this.overall_info_loaded = true
      } else {
        this.overall_info = {}
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadOnTimeArrival(facility_id, order, role) {
    this.isLoading = true
    this.ontime_arrival_loaded = false
    const url = `/api/v1/people/arrival_on_time?facility_id=${facility_id}&&order=${order}&&role=${role}`
    console.log(url)
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_ontime_arrival = response
        this.ontime_arrival_loaded = true
      } else {
        this.data_ontime_arrival = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
}

const peopleStore = new PeopleDashboardStore()

export default peopleStore
