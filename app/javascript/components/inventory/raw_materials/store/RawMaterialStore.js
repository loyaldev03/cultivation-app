import { observable, action, computed, toJS } from 'mobx'
import { httpGetOptions } from '../../../utils'
import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
class RawMaterialStore {
  @observable isLoading = false
  @observable materials = []
  @observable filter = ''
  @observable columnFilters = {}

  @action
  async load(materials = []) {
    this.materials = materials
  }

  @action
  prepend(newMaterial) {
    this.materials.replace([newMaterial, ...this.materials.slice()])
  }

  @action
  update(material) {
    const index = this.materials.findIndex(x => x.id === material.id)
    if (index >= 0) {
      this.materials = this.materials.map(x =>
        x.id === material.id ? material : x
      )
    } else {
      this.materials.unshift(material)
    }
  }

  @computed
  get bindable() {
    return this.materials.slice()
  }

  @computed
  get filteredList() {
    const list = this.materials.map(x => x.attributes)
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return list.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const field1 = `${b.facility_strain.strain_name}`.toLowerCase()
        const field2 = b.product_name.toLowerCase()
        const field3 = b.purchase_order.purchase_order_no.toLowerCase()
        const filter = this.filter.toLowerCase()
        return (
          field1.includes(filter) ||
          field2.includes(filter) ||
          field3.includes(filter)
        )
      })
    } else {
      return list
    }
  }

  /* + Required for column filter */
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
}

const rawMaterialStore = new RawMaterialStore()
export default rawMaterialStore
