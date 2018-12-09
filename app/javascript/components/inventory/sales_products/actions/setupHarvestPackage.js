import { httpPostOptions } from '../../../utils'

export const saveHarvestPackage = payload => {
  return fetch('/api/v1/sales_products/setup_harvest_package', httpPostOptions(payload))
    .then(response => {
      // console.log(response.status)
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
      // if (payload.id) {
      //   rawMaterialStore.update(data.data)
      // } else {
      //   rawMaterialStore.prepend(data.data)
      // }

      return result
    })
}
