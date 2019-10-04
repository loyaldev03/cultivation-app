import { observable, action, computed, toJS, autorun } from 'mobx'
import { httpGetOptions } from '../../../utils'
import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
class RawMaterialStore {
  @observable isLoading = false
  @observable loading = false
  @observable materials = []
  @observable columnFilters = {}
  @observable metadata = {}
  @observable searchTerm = ''
  @observable filter = {
    facility_id: '',
    type: '',
    page: 0,
    limit: 20
  }

  constructor() {
    autorun(
      () => {
        if (this.filter.facility_id) {
          if (this.searchTerm === null) {
            this.searchTerm = ''
          }
          this.loadRawMaterials()
        }
      },
      { delay: 700 }
    )
  }

  @action
  async loadRawMaterials() {
    this.loading = true
    let apiUrl = `/api/v1/raw_materials/all_seeds?type=${
      this.filter.type
    }&facility_id=${this.filter.facility_id}`

    apiUrl += `&page=${this.filter.page}&limit=${this.filter.limit}&search=${
      this.searchTerm
    }`

    try {
      const response = await (await fetch(apiUrl, httpGetOptions)).json()
      if (response && response.data) {
        this.materials = response.data.map(x => x.attributes)
        this.metadata = Object.assign({ pages: 0 }, response.metadata)
      } else {
        this.materials = []
        this.metadata = { pages: 0 }
        this.isDataLoaded = false
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.loading = false
    }
  }

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
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return this.materials.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const filterLc = this.searchTerm.toLowerCase()
        const field1 = `${b.product_name}`.toLowerCase()
        const field2 = `${b.po_number}`.toLowerCase()
        const field3 = `${b.invoice_number}`.toLowerCase()
        const results =
          field1.includes(filterLc) ||
          field2.includes(filterLc) ||
          field3.includes(filterLc)
        return results
      })
    } else {
      return this.materials
    }
  }

  @action
  setFilter(filter) {
    this.filter = {
      facility_id: filter.facility_id,
      type: filter.type,
      page: filter.page,
      limit: filter.limit
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
