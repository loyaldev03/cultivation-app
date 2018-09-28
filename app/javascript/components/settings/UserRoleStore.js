import { observable, action, runInAction, toJS } from 'mobx'

class UserRoleStore {
  @observable isLoading = false
  @observable userRoles

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
}

const userRoleStore = new UserRoleStore()

export default userRoleStore
