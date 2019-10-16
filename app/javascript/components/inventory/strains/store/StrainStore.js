import { observable, action, toJS } from 'mobx'
import { httpGetOptions } from '../../../utils';

class StrainStore {
  strains = observable([])
  strains_info = observable([])
  @observable isLoading = false
  @observable info_loaded = false

  @action
  async loadStrainInfo(facility_id) {
    this.isLoading = true
    this.info_loaded = false
    const url = `/api/v1/strains/strains_info?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.strains_info = response.map(x => x)
        this.info_loaded = true
      } else {
        this.overall_info = {}
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  load(strains) {
    this.strains.replace(strains)
  }

  @action
  prepend(strain) {
    this.strains.replace([strain, ...this.strains.slice()])
  }

  @action
  update(strain) {
    const index = this.strains.findIndex(
      x => x.attributes.id === strain.attributes.id
    )
    this.strains[index] = strain
  }
}

const strainStore = new StrainStore()
export default strainStore
