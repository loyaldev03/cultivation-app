import { observable, action } from 'mobx'

class NutrientProfileStore {
  nutrients = observable([])
  id = ''

  @action
  load(nutrientProfile) {
    this.nutrients.replace(nutrientProfile.nutrients)
    this.id.replace(nutrientProfile.id)
    console.log(this.id)
    console.log(this.nutrients)
  }
}

const nutrientProfileStore = new NutrientProfileStore()
export default nutrientProfileStore
