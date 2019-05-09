import { observable, action, computed } from 'mobx'
import { httpGetOptions, httpPostOptions, toast } from '../../utils'
class WorkerScheduleStore {
  @observable isLoading = false
  @observable scheduleData = {}

  @action
  getTaskByDate = async date => {
    this.isLoading = true
    try {
      let url = `/api/v1/daily_tasks/tasks_by_date?date=${date}`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        console.log(response)
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
  getTaskByDateArr = async () => {
    try {
      let url = `/api/v1/daily_tasks/work_schedules?start_date=2019-2-21&end_date=2020-2-27`
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        console.log(response)
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
        console.log(response)
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
