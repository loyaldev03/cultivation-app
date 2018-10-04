import { observable, action, runInAction, toJS } from 'mobx'

class UserRoleStore {
  @observable
  isLoading = false
  @observable
  userRoles

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
        this.userRoles = response.data
      })
    } catch (err) {
      console.error(err)
    }
  }

  @action
  setUser(user) {
    const found = this.userRoles.attributes.users.find(x => x.id === user.id)
    if (found) {
      this.userRoles.attributes.users = this.userRoles.attributes.users.map(
        u => (u.id === user.id ? user : u)
      )
    } else {
      this.userRoles.attributes.users.push(user)
    }
  }

  getUser(userId) {
    if (
      userId &&
      this.userRoles.attributes &&
      this.userRoles.attributes.users
    ) {
      const user = this.userRoles.attributes.users.find(x => x.id === userId)
      return toJS(user)
    }
    return null
  }

  getRoleName(roleId) {
    if (roleId) {
      const role = this.userRoles.attributes.roles.find(x => x.id === roleId)
      return role ? role.name : 'Invalid Role'
    }
  }

  getFacilityCode(facilityId) {
    if (facilityId) {
      const facility = this.userRoles.attributes.facilities.find(
        x => x.id === facilityId
      )
      return facility ? facility.name : 'Invalid Facility'
    }
  }
}

const userRoleStore = new UserRoleStore()

export default userRoleStore
