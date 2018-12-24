import rawMaterialStore from '../store/RawMaterialStore'
import { httpPostOptions } from '../../../utils'

export const setupPurchasedClones = payload => {
  return fetch(
    '/api/v1/raw_materials/setup_purchased_clones',
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
        return result
      }

      if (payload.id) {
        rawMaterialStore.update(data.data)
      } else {
        rawMaterialStore.prepend(data.data)
      }

      return result
    })
}
