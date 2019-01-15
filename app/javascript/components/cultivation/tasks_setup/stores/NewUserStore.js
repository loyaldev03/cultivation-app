import { observable, action, runInAction, toJS, computed } from 'mobx'
import { httpGetOptions } from '../../../utils'
import Fuse from 'fuse.js'

class UserStore {
  @observable searchKeyword
  @observable filterRoles = []
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable users

  @action
  async loadUsers() {
    this.isLoading = true
    const url = '/api/v1/users'
    try {
      const res = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (res.data) {
          const users = res.data.map(x => x.attributes)
          this.fuze = new Fuse(users, {
            id: 'id',
            threshold: 0.3,
            keys: ['first_name', 'last_name', 'roles.name', 'email']
          })
          this.users = users
          this.isDataLoaded = true
        } else {
          this.users = []
          this.isDataLoaded = false
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoading = false
    }
  }

  @action
  toggleRoleFilter(roleId, roleName) {
    if (roleId) {
      const found = this.filterRoles.find(role => role.id === roleId)
      if (found) {
        this.filterRoles = this.filterRoles.filter(role => role.id !== roleId)
      } else {
        this.filterRoles.push({ id: roleId, name: roleName })
      }
    }
  }

  getUserById(id) {
    return this.users.find(x => x.id === id)
  }

  @computed get searchResult() {
    if (this.isDataLoaded) {
      const roleIds = this.filterRoles.map(r => r.id)
      let result = this.users
      if (this.searchKeyword) {
        const filtered = this.fuze.search(this.searchKeyword)
        result = this.users.filter(t => filtered.includes(t.id))
      }
      if (roleIds && roleIds.length) {
        result = result.filter(user =>
          user.roles.some(role => roleIds.includes(role.id))
        )
      }
      return result
    } else {
      return []
    }
  }
}

const userStore = new UserStore()

export default userStore
