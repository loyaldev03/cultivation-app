import { httpGetOptions } from '../../../utils'
import harvestPackageStore from '../store/HarvestPackageStore'

const loadHarvestPackages = () => {
  return fetch('/api/v1/sales_products/harvest_packages', httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      if (status !== 200) {
        return result
      }
      harvestPackageStore.load(data.data)
    })
}

export default loadHarvestPackages
