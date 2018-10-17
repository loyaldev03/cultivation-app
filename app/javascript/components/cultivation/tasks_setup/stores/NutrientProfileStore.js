import { observable, action } from 'mobx'

class NutrientProfileStore {
  nutrients = observable([])
  id = ''

  @action
  load(nutrientProfile) {
    if (nutrientProfile !== null){
      this.nutrients.replace(nutrientProfile.nutrients)
      this.id = nutrientProfile['_id']['$oid']
    }
  }
}

const nutrientProfileStore = new NutrientProfileStore()
export default nutrientProfileStore
