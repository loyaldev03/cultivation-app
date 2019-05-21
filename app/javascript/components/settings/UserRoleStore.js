import { observable, action, runInAction, toJS } from 'mobx'
import { httpGetOptions, httpPostOptions, toast } from '../utils'
import { format } from 'date-fns'

class UserRoleStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable facilities
  @observable roles
  @observable users
  @observable modules
  @observable companyWorkSchedules
  @observable nonExemptSchedules
  @observable isLoadingSchedule = false

  @action
  async loadUsers(includeInactiveUser = false) {
    this.isLoading = true
    let url = '/api/v1/user_roles/search'
    if (includeInactiveUser) {
      url = url + '?include_inactive_user=1'
    }
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (response.data && response.data.attributes) {
          const {
            facilities,
            users,
            roles,
            modules,
            company_work_schedules
          } = response.data.attributes
          this.isDataLoaded = true
          this.facilities = facilities || []
          this.users = users || []
          this.roles = roles || []
          this.modules = modules || []
          this.companyWorkSchedules = company_work_schedules || []
        } else {
          this.isDataLoaded = false
          this.facilities = []
          this.users = []
          this.roles = []
          this.modules = []
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoading = false
    }
  }

  async getSchedulesByDate(userId, date) {
    this.isLoadingSchedule = true

    let date_formatted = format(date, 'DD/MM/YYYY')
    let url = `/api/v1/user_roles/schedules_by_date?user_id=${userId}&date=${date_formatted}`

    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (response.data) {
          this.nonExemptSchedules = response.data || []
        } else {
          this.nonExemptSchedules = []
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoadingSchedule = false
    }
  }

  async copyScheduleWeek(userId, from_date, to_date) {
    let from_date_formatted = format(from_date, 'DD/MM/YYYY')
    let to_date_formatted = format(to_date, 'DD/MM/YYYY')

    let url = `/api/v1/user_roles/copy_schedule_week`
    let payload = { user_id: userId, from: from_date_formatted, to: to_date_formatted }
    try {
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      runInAction(() => {
        if (response.data) {
          toast('Data copied !', 'success')
        } else {
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
    }
  }

  @action
  updateUser(user) {
    const found = this.users.find(x => x.id === user.id)
    if (found) {
      this.users = this.users.map(u => (u.id === user.id ? user : u))
    } else {
      this.users.push(user)
    }
  }

  @action
  updateRole(role) {
    const found = this.roles.find(x => x.id === role.id)
    if (found) {
      this.roles = this.roles.map(r => (r.id === role.id ? role : r))
    } else {
      this.roles.push(role)
    }
  }

  @action
  deleteRole(roleId) {
    this.roles = this.roles.filter(r => r.id !== roleId)
  }

  getUser(userId) {
    if (userId && this.users) {
      const user = this.users.find(x => x.id === userId)
      return toJS(user)
    }
    return null
  }

  getRole(roleId) {
    if (roleId && this.roles) {
      const role = this.roles.find(x => x.id === roleId)
      return toJS(role)
    }
    return null
  }

  getRoleName(roleId) {
    if (roleId) {
      const role = this.roles.find(x => x.id === roleId)
      return role ? role.name : 'Invalid Role'
    }
  }

  getFacilityCode(facilityId) {
    if (facilityId) {
      const facility = this.facilities.find(x => x.id === facilityId)
      return facility ? facility.code : 'Invalid Facility'
    }
  }
}

const userRoleStore = new UserRoleStore()

export default userRoleStore
