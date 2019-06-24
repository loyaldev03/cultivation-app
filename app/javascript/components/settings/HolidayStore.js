import { observable, action, runInAction, toJS } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  toast
} from '../utils'

import { addDays, differenceInCalendarDays, parse } from 'date-fns'

function parseTask(holidayAttributes) {
  const { date } = holidayAttributes
  const new_date = new Date(date)
  console.log(new_date)
  return Object.assign(holidayAttributes, {
    date: new_date
  })
}

class HolidayStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable holidays = []
  @observable holiday = ''

  @action
  async showHoliday(date) {
    this.isLoading = true
    const url = `/api/v1/holidays?date=${date}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.holiday = response.data
        this.isDataLoaded = true
      } else {
        this.holiday = ''

        this.isDataLoaded = false
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
      // this.loadIssues(batchId)
    }
  }

  @action
  async updateHoliday(holiday) {
    this.isLoading = true
    const url = `/api/v1/holidays/${holiday.id}`
    try {
      const response = await (await fetch(
        url,
        httpPutOptions({ holiday })
      )).json()
      if (response.data) {
        toast('Holiday updated', 'success')
        await this.loadHolidays(2019)
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.log(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async loadHolidays(year) {
    this.isLoading = true
    const url = `/api/v1/holidays?year=${year}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        const holidays = response.data.map(res => parseTask(res.attributes))
        this.holidays = holidays
        this.isDataLoaded = true
      } else {
        this.holidays = []
        this.isDataLoaded = false
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
      // this.loadIssues(batchId)
    }
  }

  @action
  async createHoliday(holiday) {
    this.isLoading = true
    const url = `/api/v1/holidays`
    try {
      const response = await (await fetch(
        url,
        httpPostOptions({ holiday })
      )).json()
      if (response.data) {
        toast('Holiday added', 'success')
        await this.loadHolidays(2019)
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.log(error)
    } finally {
      this.isLoading = false
    }
  }

  getHolidays() {
    return toJS(this.holidays)
  }
}

const holidayStore = new HolidayStore()

export default holidayStore
