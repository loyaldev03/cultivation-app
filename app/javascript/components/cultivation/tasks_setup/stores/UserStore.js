import { observable, action, computed } from 'mobx'

class UserStore {
  users = observable([])

  @observable isLoading = false

  @action
  load(newUsers) {
    // let array_users = this.toDropdown(newUsers)
    this.users.replace(newUsers)
    // this.dropdown_users.replace(array_users)
  }

  @computed
  get userSelect() {
    this.users
  }



  
}

const userStore = new UserStore()
export default userStore
