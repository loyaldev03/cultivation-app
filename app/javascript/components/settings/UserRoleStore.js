import { observable, action, runInAction, toJS } from 'mobx'

class UserRoleStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable facilities
  @observable roles
  @observable users
  @observable modules

  @action
  async loadUsers() {
    this.isLoading = true
    const url = '/api/v1/user_roles/search'
    try {
      const response = await (await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })).json()
      runInAction(() => {
        this.isLoading = false
        if (response.data && response.data.attributes) {
          const { facilities, users, roles, modules } = response.data.attributes
          this.isDataLoaded = true
          this.facilities = facilities || []
          this.users = users || []
          this.roles = roles || []
          this.modules = modules || []
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
    }
  }

  @action
  setUser(user) {
    const found = this.users.find(x => x.id === user.id)
    if (found) {
      this.users = this.users.map(
        u => (u.id === user.id ? user : u)
      )
    } else {
      this.users.push(user)
    }
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
      const facility = this.facilities.find(
        x => x.id === facilityId
      )
      return facility ? facility.code : 'Invalid Facility'
    }
  }
}

const userRoleStore = new UserRoleStore()

export default userRoleStore
