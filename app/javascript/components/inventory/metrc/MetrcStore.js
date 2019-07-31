import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import { observable, action, runInAction, computed, toJS } from 'mobx'
import { httpGetOptions, httpPostOptions, toast } from '../../utils'

class MetrcStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable metrcs
  @observable filter = ''
  @observable columnFilters = {}


  @action
  async loadMetrcs(facilityId) {
    this.isLoading = true
    const url = `/api/v1/metrc?facility_id=${facilityId}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      runInAction(() => {
        if (response && response.data) {
          this.metrcs = response.data.map(rec => {
            return { ...rec.attributes, id: rec.id }
          })
          this.isDataLoaded = true
        } else {
          this.metrcs = []
          this.isDataLoaded = false
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.isLoading = false
    }
  }

  @computed
  get filteredList() {
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return this.metrcs.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const metrcTagLc = `${b.tag || ''} ${b.tag_type}`.toLowerCase()
        const filterLc = this.filter.toLowerCase()
        const result = metrcTagLc.includes(filterLc)
        return result
      })
    } else {
      return this.metrcs
    }
  }

  isFiltered = record => {
    let f = Object.keys(this.columnFilters).find(key => {
      const filter = this.columnFilters[key].filter(x => x.value === false)
      return filter.find(x => x.label === record[key])
    })
    return f ? true : false
  }

  updateFilterOptions = (propName, filterOptions) => {
    const updated = {
      ...this.columnFilters,
      [propName]: filterOptions
    }
    this.columnFilters = updated
  }

  getUniqPropValues = propName => {
    return uniq(this.filteredList.map(x => x[propName]).sort())
  }


//   @action
//   addPlantToBatch(plant_id, quantity) {
//     const plant = this.batch.selected_plants.find(x => x.plant_id === plant_id)
//     if (plant) {
//       plant.quantity = quantity
//       this.batch.selected_plants = this.batch.selected_plants.map(x =>
//         x.plant_id === plant_id ? plant : x
//       )
//     } else {
//       this.batch.selected_plants.push({
//         plant_id,
//         quantity
//       })
//     }
//   }

}

const metrcStore = new MetrcStore()

export default metrcStore
