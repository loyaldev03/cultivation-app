import { observable, action, runInAction } from 'mobx'

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
}

const userRoleStore = new UserRoleStore()

export default userRoleStore
