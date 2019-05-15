import { observable, action, computed } from 'mobx'
import { httpGetOptions, httpPostOptions, toast } from '../../utils'
class WorkerScheduleStore {
  @observable isLoading = false
  @observable scheduleData = {}
  @observable taskData = []

  @action
  getTaskByDate = async date => {
    this.isLoading = true
    try {
      let url = `/api/v1/daily_tasks/tasks_by_date?date=${date}`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        return response
      }
    } catch (err) {
      console.error(err)
      return null
    } finally {
      this.isLoading = false
    }
  }
  @action
  getTaskByMonth = async (monthAndYearString, date) => {
    var first = new Date(date.getYear(), date.getMonth(), 1)
    var last = new Date(date.getYear(), date.getMonth() + 1, 0)
    try {
      let url = `/api/v1/daily_tasks/tasks_by_date_range?start_date=${monthAndYearString +
        first.getDate()}&end_date=${monthAndYearString + last.getDate()}`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.taskData = response
        return response
      }
    } catch (err) {
      console.error(err)
      return null
    } finally {
      this.isLoading = false
    }
  }
  @action
  getTaskByWeekArr = async (start, end) => {
    try {
      let url = `/api/v1/daily_tasks/work_schedules?start_date=${start}&end_date=${end}`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        return response
      }
    } catch (err) {
      console.error(err)
      return null
    } finally {
      this.isLoading = false
    }
  }
  @action
  getTaskByDay = async (start) => {
    try {
      let url = `/api/v1/daily_tasks/work_schedules?start_date=${start}&end_date=${start}`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        return response
      }
    } catch (err) {
      console.error(err)
      return null
    } finally {
      this.isLoading = false
    }
  }
  @action
  savePto = async (start_date, end_date, description) => {
    this.isLoading = true
    try {
      let url = `/api/v1/daily_tasks/save_pto`
      const payload = {
        start_date,
        end_date,
        description
      }
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response) {
        toast('PTO submitted', 'success')
        return response
      }
    } catch (err) {
      console.error(err)
      return null
    } finally {
      this.isLoading = false
    }
  }

  @action
  saveOt = async (start_date, end_date, description) => {
    this.isLoading = true
    try {
      let url = `/api/v1/daily_tasks/save_ot`
      const payload = {
        start_date,
        end_date,
        description
      }
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response) {
        toast('OT submitted', 'success')
        return response
      }
    } catch (err) {
      console.error(err)
      return null
    } finally {
      this.isLoading = false
    }
  }

  @action
  getWorkScheduleByDate = async date => {
    this.isLoading = true
    try {
      let url = `/api/v1/daily_tasks/schedule_by_date?date=${date}`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        return response
      }
    } catch (err) {
      console.error(err)
      return null
    } finally {
      this.isLoading = false
    }
  }
}
const workerScheduleStore = new WorkerScheduleStore()
export default workerScheduleStore
