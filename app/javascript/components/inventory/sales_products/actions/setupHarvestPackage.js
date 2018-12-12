import { httpPostOptions } from '../../../utils'
import harvestPackageStore from '../store/HarvestPackageStore'

const saveHarvestPackage = payload => {
  return fetch(
    '/api/v1/sales_products/setup_harvest_package',
    httpPostOptions(payload)
  )
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      if (status !== 200) {
        console.log(result)
        return result
      }

      console.log(result)
      if (payload.id) {
        harvestPackageStore.update(data.data)
      } else {
        harvestPackageStore.prepend(data.data)
      }

      return result
    })
}

export default saveHarvestPackage