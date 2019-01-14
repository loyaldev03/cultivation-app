import { observable, action, runInAction, toJS, computed } from 'mobx'
import { httpGetOptions } from '../../../utils'
import Fuse from 'fuse.js'

class UserStore {
  @observable searchKeyword
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
            threshold: 0.1,
            keys: ['first_name', 'last_name']
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

  getUserById(id) {
    return this.users.find(x => x.id === id)
  }

  @computed get searchResult() {
    if (this.isDataLoaded) {
      if (this.searchKeyword) {
        const filtered = this.fuze.search(this.searchKeyword)
        return this.users.filter(t => filtered.includes(t.id))
      } else {
        return this.users
      }
    } else {
      return []
    }
  }
}

const userStore = new UserStore()

export default userStore
