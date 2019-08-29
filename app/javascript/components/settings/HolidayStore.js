import { observable, action, toJS } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  toast
} from '../utils'
import { parse, getYear } from 'date-fns'

function parseTask(holidayAttributes) {
  const { start_date, end_date, date } = holidayAttributes
  const new_date = parse(date)
  const new_start_date = parse(start_date)
  const new_end_date = parse(end_date)

  return Object.assign(holidayAttributes, {
    date: new_date,
    start_date: new_start_date,
    end_date: new_end_date
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
    const url = `/api/v1/holidays/show_by_date/?date=${date}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.holiday = parseTask(response.data)
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
        await this.loadHolidays(getYear(holiday.start_date))
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
        const holidays = response.data.map(res => parseTask(res))
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
        await this.loadHolidays(getYear(holiday.start_date))
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
