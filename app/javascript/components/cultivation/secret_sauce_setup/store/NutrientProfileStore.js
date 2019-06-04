import { observable, action, runInAction, toJS } from 'mobx'
import { httpGetOptions, httpPostOptions } from '../../../utils'

class NutrientProfileStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable nutrients = []
  @observable phases = []
  @observable currPhase = ''
  @observable nutrientProducts = []

  @action
  async loadNutrients(batchId, phases = '') {
    this.isDataLoaded = true
    const url = `/api/v1/batches/${batchId}/nutrient_profiles?phases=${phases}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response.data) {
        this.nutrients = response.data
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async loadNutrientsByPhases(batchId) {
    this.isDataLoaded = true
    const url = `/api/v1/batches/${batchId}/nutrient_profiles/by_phases`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response.data) {
        this.currPhase = response.data[0]
        this.phases = response.data
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }
  @action
  async loadProducts(facility_id) {
    this.isDataLoaded = true
    // const url = `/api/v1/batches/${batchId}/nutrient_profiles/by_phases`
    const url = `/api/v1/products?type=raw_materials&category=nutrients&facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response.data) {
        const products = response.data.map(x => ({
          label: x.attributes.name,
          value: x.attributes.id,
          ...x.attributes
        }))
        console.log(products)
        this.nutrientProducts = products
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  async updateWeekNutrient(batchId, phase, nutrient_data) {
    this.isLoading = true
    const url = `/api/v1/batches/${batchId}/nutrient_profiles/update_week_nutrient?phase=${phase}`
    try {
      const payload = nutrient_data
      const response = await (await fetch(url, httpPostOptions(payload))).json()
      if (response.data) {
        const updated_phase = this.phases.find(e => e.phase_name === phase)

        let updated_week = updated_phase.weeks.find(
          e => e.name === response.data.name
        )
        updated_week = response.data

        const new_week = updated_phase.weeks.map(u => {
          return u.name === response.data.name ? updated_week : u
        })
        updated_phase.weeks = new_week

        const updated_phases = this.phases.map(t => {
          return t.phase_name === phase ? updated_phase : t
        })

        this.phases = updated_phases
      } else {
        console.error(response.errors)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  setCurrentNutrientPhase(phase_name) {
    const phase = this.phases.find(e => e.phase_name === phase_name)
    this.currPhase = phase
  }

  getNutrientByElement(week, element) {
    return this.nutrients.find(
      x => x.task_name === week && x.element === element
    )
  }

  getNutrientProducts() {
    return toJS(this.nutrientProducts)
  }

  getPhases() {
    return toJS(this.phases)
  }

  getCurrentPhase() {
    return toJS(this.currPhase)
  }
}

const nutrientProfileStore = new NutrientProfileStore()

export default nutrientProfileStore
