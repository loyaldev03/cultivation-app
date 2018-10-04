import { observable, action, computed } from 'mobx'

class UserStore {
  users = observable([])
  @observable
  isLoading = false

  @action
  load(newUsers) {
    let array_users = []
    for (var i = 0; i < newUsers.length; i++) {
      array_users.push({
        value: newUsers[i].id,
        label: newUsers[i].attributes.full_name
      })
    }
    this.users.replace(array_users)
  }

  // @action
  // prepend(newPlants = []) {
  //   if (Array.isArray(newPlants)) {
  //     this.plants.replace(newPlants.concat(this.plants.slice()))
  //   } else {
  //     this.plants.replace([newPlants, ...this.plants.slice()])
  //   }
  // }

  // @action
  // add(newPlants = []) {
  //   // console.log(newPlants)
  //   // this.plants.concat(newPlants)

  //   newPlants.forEach(x => this.plants.push(x))
  //   // this.plants.push([{ attributes: { serial_no: 'xxx' }, id: `${this.plants.length + 1}` }].slice())
  // }

  // @action
  // update(plant) {
  //   // find and replace...
  // }

  @computed
  get userSelect() {
    this.users
  }
}

const userStore = new UserStore()
export default userStore
