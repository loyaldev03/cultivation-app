import { observable, action, computed } from 'mobx'

class UserStore {
  users = observable([])
  @observable isLoading = false

  @action
  load(newUsers) {
    this.users.replace(newUsers)
  }

  @computed
  get userSelect() {
    this.users
  }
}

const userStore = new UserStore()
export default userStore
